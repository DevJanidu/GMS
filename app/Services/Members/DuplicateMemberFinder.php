<?php

namespace App\Services\Members;

use App\Models\Member;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * Flags likely-duplicate members (matching email, phone, or full name) so
 * registration can warn staff instead of silently creating a second record.
 */
class DuplicateMemberFinder
{
    /**
     * @return Collection<int, Member>
     */
    public function find(
        string $firstName,
        string $lastName,
        ?string $email,
        ?string $phone,
        ?int $exceptMemberId = null,
    ): Collection {
        return Member::query()
            ->where(function (Builder $query) use ($firstName, $lastName, $email, $phone) {
                if ($email) {
                    $query->orWhere('email', $email);
                }

                if ($phone) {
                    $query->orWhere('phone', $phone);
                }

                $query->orWhere(function (Builder $query) use ($firstName, $lastName) {
                    $query->whereRaw('lower(first_name) = ?', [mb_strtolower($firstName)])
                        ->whereRaw('lower(last_name) = ?', [mb_strtolower($lastName)]);
                });
            })
            ->when($exceptMemberId, fn (Builder $query) => $query->whereKeyNot($exceptMemberId))
            ->limit(5)
            ->get();
    }
}
