<?php

namespace App\Http\Controllers;

use App\Events\MemberRegistered;
use App\Http\Requests\Members\StoreMemberRequest;
use App\Http\Requests\Members\UpdateMemberRequest;
use App\Http\Resources\MemberDocumentResource;
use App\Http\Resources\MemberResource;
use App\Models\Branch;
use App\Models\Member;
use App\Services\Members\DuplicateMemberFinder;
use App\Services\Members\MemberNumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Member::class);

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $branchId = $request->integer('branch_id') ?: null;

        $members = Member::query()
            ->with('branch')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('member_number', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('members/index', [
            'members' => MemberResource::collection($members),
            'filters' => [
                'search' => $search ?: null,
                'status' => $status ?: null,
                'branch_id' => $branchId,
            ],
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Member::class);

        return Inertia::render('members/create', [
            'branches' => Branch::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'duplicates' => $request->session()->get('duplicates'),
        ]);
    }

    public function store(
        StoreMemberRequest $request,
        MemberNumberGenerator $numberGenerator,
        DuplicateMemberFinder $duplicateFinder,
    ): RedirectResponse {
        $data = $request->validated();

        if (empty($data['confirm_duplicate'])) {
            $duplicates = $duplicateFinder->find(
                $data['first_name'],
                $data['last_name'],
                $data['email'] ?? null,
                $data['phone'] ?? null,
            );

            if ($duplicates->isNotEmpty()) {
                return back()->with('duplicates', MemberResource::collection($duplicates)->resolve());
            }
        }

        $member = new Member(collect($data)->except(['photo', 'confirm_duplicate'])->all());
        $member->member_number = $numberGenerator->next($request->user()->tenant);
        $member->created_by = $request->user()->id;
        $member->joined_at = $data['joined_at'] ?? now()->toDateString();

        if ($request->hasFile('photo')) {
            $member->photo_path = $request->file('photo')->store('members/photos', 'public') ?: null;
        }

        DB::transaction(function () use ($member): void {
            $member->save();

            $eventId = (string) Str::uuid();
            $occurredAt = now()->toImmutable()->toIso8601String();

            DB::afterCommit(fn () => MemberRegistered::dispatch(
                eventId: $eventId,
                occurredAt: $occurredAt,
                tenantId: $member->tenant_id,
                branchId: $member->branch_id,
                memberId: $member->id,
                registeredBy: $member->created_by,
            ));
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => "Member {$member->fullName()} registered."]);

        return to_route('members.show', $member);
    }

    public function show(Member $member): Response
    {
        $this->authorize('view', $member);

        $member->load(['branch', 'documents.uploadedBy', 'portalAccount']);

        return Inertia::render('members/show', [
            'member' => (new MemberResource($member))->resolve(),
            'documents' => MemberDocumentResource::collection($member->documents)->resolve(),
        ]);
    }

    public function edit(Member $member): Response
    {
        $this->authorize('update', $member);

        return Inertia::render('members/edit', [
            'member' => (new MemberResource($member))->resolve(),
            'branches' => Branch::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateMemberRequest $request, Member $member): RedirectResponse
    {
        $data = $request->validated();

        $member->fill(collect($data)->except(['photo'])->all());

        if ($request->hasFile('photo')) {
            $member->photo_path = $request->file('photo')->store('members/photos', 'public') ?: null;
        }

        $member->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Member updated.']);

        return to_route('members.show', $member);
    }
}
