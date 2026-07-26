<?php

namespace Tests\Feature\MemberPortal;

use App\Models\Branch;
use App\Models\Member;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Receipt;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Models\InAppNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class MemberPortalBoundaryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_requires_an_authenticated_active_portal_account(): void
    {
        $this->getJson('/api/v1/member-portal/dashboard')->assertUnauthorized();

        $tenant = Tenant::factory()->create();
        $user = User::factory()->for($tenant)->create();
        $member = Member::factory()->for($tenant)->create();

        MemberPortalAccount::query()->create([
            'tenant_id' => $tenant->id,
            'member_id' => $member->id,
            'user_id' => $user->id,
            'status' => MemberPortalAccount::STATUS_SUSPENDED,
            'activated_at' => now()->subDay(),
            'suspended_at' => now(),
        ]);

        $this->actingAs($user)
            ->getJson('/api/v1/member-portal/dashboard')
            ->assertForbidden()
            ->assertJsonMissing(['member_number' => $member->member_number]);
    }

    public function test_it_returns_only_the_signed_in_members_dashboard_data(): void
    {
        $tenant = Tenant::factory()->create();
        $branch = Branch::factory()->for($tenant)->create();
        $user = User::factory()->for($tenant)->create();
        $member = Member::factory()->for($tenant)->for($branch)->create([
            'first_name' => 'Portal',
            'last_name' => 'Member',
        ]);
        $this->activePortalAccount($tenant, $user, $member);

        Membership::factory()->for($tenant)->for($branch)->for($member)->create([
            'plan_id' => null,
            'plan_name_snapshot' => 'Portal Plan',
        ]);

        AttendanceRecord::query()->create([
            'tenant_id' => $tenant->id,
            'branch_id' => $branch->id,
            'member_id' => $member->id,
            'request_id' => (string) Str::uuid(),
            'status' => 'checked_in',
            'source' => 'phone_camera',
            'checked_in_at' => now(),
        ]);

        InAppNotification::query()->create([
            'tenant_id' => $tenant->id,
            'member_id' => $member->id,
            'type' => 'membership',
            'title' => 'Own notification',
            'body' => 'Visible only to this member.',
        ]);

        $otherTenant = Tenant::factory()->create();
        $otherMember = Member::factory()->for($otherTenant)->create();
        InAppNotification::withoutGlobalScopes()->create([
            'tenant_id' => $otherTenant->id,
            'member_id' => $otherMember->id,
            'type' => 'membership',
            'title' => 'Other tenant notification',
            'body' => 'Must not be visible.',
        ]);

        $this->actingAs($user)
            ->getJson('/api/v1/member-portal/dashboard')
            ->assertOk()
            ->assertJsonPath('data.profile.member_number', $member->member_number)
            ->assertJsonPath('data.membership.plan_name', 'Portal Plan')
            ->assertJsonPath('data.membership.expired', false)
            ->assertJsonPath('data.attendance_count', 1)
            ->assertJsonPath('data.unread_notification_count', 1)
            ->assertJsonMissing(['title' => 'Other tenant notification'])
            ->assertJsonMissingPath('data.profile.id')
            ->assertJsonMissingPath('data.profile.tenant_id')
            ->assertJsonMissingPath('data.membership.notes');
    }

    public function test_it_only_updates_allow_listed_member_profile_fields(): void
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->for($tenant)->create();
        $member = Member::factory()->for($tenant)->create([
            'first_name' => 'Before',
            'status' => 'active',
        ]);
        $this->activePortalAccount($tenant, $user, $member);

        $this->actingAs($user)
            ->putJson('/api/v1/member-portal/profile', [
                'first_name' => 'After',
                'last_name' => $member->last_name,
                'phone' => '0712345678',
                'status' => 'archived',
                'tenant_id' => 999999,
                'notes' => 'attempted internal note',
            ])
            ->assertOk()
            ->assertJsonPath('data.first_name', 'After')
            ->assertJsonMissingPath('data.tenant_id')
            ->assertJsonMissingPath('data.notes');

        $member->refresh();

        $this->assertSame('After', $member->first_name);
        $this->assertSame('active', $member->status->value);
        $this->assertSame($tenant->id, $member->tenant_id);
    }

    public function test_it_does_not_disclose_qr_credential_hashes(): void
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->for($tenant)->create();
        $member = Member::factory()->for($tenant)->create();
        $this->activePortalAccount($tenant, $user, $member);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/member-portal/qr-card')
            ->assertOk()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonMissingPath('data.token_hash')
            ->assertJsonMissingPath('data.secret');

        // The signed token and public credential id are the safe, intended
        // payload (that's what the member's QR image encodes and what
        // front-desk scans) — only the stored hash/signing key must never
        // appear in the response.
        $this->assertIsString($response->json('data.qr_payload'));
        $this->assertIsString($response->json('data.credential_id'));
        $this->assertStringStartsWith('data:image/svg+xml;base64,', $response->json('data.qr_image_data_url'));
    }

    public function test_it_prevents_nested_receipt_idor(): void
    {
        $tenant = Tenant::factory()->create();
        $branch = Branch::factory()->for($tenant)->create();
        $user = User::factory()->for($tenant)->create();
        $member = Member::factory()->for($tenant)->for($branch)->create();
        $otherMember = Member::factory()->for($tenant)->for($branch)->create();
        $this->activePortalAccount($tenant, $user, $member);

        $ownReceipt = $this->portalReceipt($tenant, $branch, $member, 'OWN-RECEIPT');
        $otherReceipt = $this->portalReceipt($tenant, $branch, $otherMember, 'OTHER-RECEIPT');

        $otherTenant = Tenant::factory()->create();
        $otherBranch = Branch::factory()->for($otherTenant)->create();
        $crossTenantMember = Member::factory()->for($otherTenant)->for($otherBranch)->create();
        $crossTenantReceipt = $this->portalReceipt(
            $otherTenant,
            $otherBranch,
            $crossTenantMember,
            'CROSS-TENANT-RECEIPT',
        );

        $this->actingAs($user)
            ->getJson("/api/v1/member-portal/receipts/{$ownReceipt->public_id}")
            ->assertOk()
            ->assertJsonPath('data.receipt_number', 'OWN-RECEIPT');

        $this->actingAs($user)
            ->getJson("/api/v1/member-portal/receipts/{$otherReceipt->public_id}")
            ->assertNotFound();

        $this->actingAs($user)
            ->getJson("/api/v1/member-portal/receipts/{$crossTenantReceipt->public_id}")
            ->assertNotFound();
    }

    public function test_it_scopes_paginated_attendance_and_notifications(): void
    {
        $tenant = Tenant::factory()->create();
        $branch = Branch::factory()->for($tenant)->create();
        $user = User::factory()->for($tenant)->create();
        $member = Member::factory()->for($tenant)->for($branch)->create();
        $otherMember = Member::factory()->for($tenant)->for($branch)->create();
        $this->activePortalAccount($tenant, $user, $member);

        foreach (range(1, 3) as $index) {
            AttendanceRecord::query()->create([
                'tenant_id' => $tenant->id,
                'branch_id' => $branch->id,
                'member_id' => $member->id,
                'request_id' => (string) Str::uuid(),
                'status' => 'checked_in',
                'source' => 'manual',
                'checked_in_at' => now()->subMinutes($index),
            ]);
        }

        AttendanceRecord::query()->create([
            'tenant_id' => $tenant->id,
            'branch_id' => $branch->id,
            'member_id' => $otherMember->id,
            'request_id' => (string) Str::uuid(),
            'status' => 'checked_in',
            'source' => 'manual',
            'checked_in_at' => now(),
        ]);

        InAppNotification::query()->create([
            'tenant_id' => $tenant->id,
            'member_id' => $member->id,
            'type' => 'account',
            'title' => 'Visible',
            'body' => 'Own message',
        ]);
        InAppNotification::query()->create([
            'tenant_id' => $tenant->id,
            'member_id' => $otherMember->id,
            'type' => 'account',
            'title' => 'Hidden',
            'body' => 'Other member message',
        ]);

        $this->actingAs($user)
            ->getJson('/api/v1/member-portal/attendance?per_page=2')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.last_page', 2);

        $this->actingAs($user)
            ->getJson('/api/v1/member-portal/notifications')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Visible')
            ->assertJsonMissing(['title' => 'Hidden']);

        $this->actingAs($user)
            ->getJson('/api/v1/member-portal/attendance?per_page=101')
            ->assertUnprocessable();
    }

    private function activePortalAccount(
        Tenant $tenant,
        User $user,
        Member $member,
    ): MemberPortalAccount {
        return MemberPortalAccount::query()->create([
            'tenant_id' => $tenant->id,
            'member_id' => $member->id,
            'user_id' => $user->id,
            'status' => MemberPortalAccount::STATUS_ACTIVE,
            'activated_at' => now(),
        ]);
    }

    private function portalReceipt(
        Tenant $tenant,
        Branch $branch,
        Member $member,
        string $receiptNumber,
    ): Receipt {
        $invoice = Invoice::factory()->create([
            'tenant_id' => $tenant->id,
            'branch_id' => $branch->id,
            'member_id' => $member->id,
            'currency' => 'LKR',
        ]);
        $payment = Payment::factory()->create([
            'tenant_id' => $tenant->id,
            'branch_id' => $branch->id,
            'invoice_id' => $invoice->id,
        ]);

        return Receipt::query()->create([
            'tenant_id' => $tenant->id,
            'branch_id' => $branch->id,
            'invoice_id' => $invoice->id,
            'payment_id' => $payment->id,
            'receipt_number' => $receiptNumber,
            'snapshot' => [
                'currency' => 'LKR',
                'amount_cents' => $payment->amount_cents,
                'method' => $payment->method->value,
                'paid_at' => $payment->paid_at->toIso8601String(),
                'items' => [],
            ],
            'generated_at' => now(),
        ]);
    }
}
