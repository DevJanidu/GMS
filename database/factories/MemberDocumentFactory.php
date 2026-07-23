<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\MemberDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MemberDocument>
 */
class MemberDocumentFactory extends Factory
{
    protected $model = MemberDocument::class;

    public function definition(): array
    {
        return [
            'member_id' => Member::factory(),
            'name' => fake()->sentence(2).'.pdf',
            'file_path' => 'members/documents/'.fake()->uuid().'.pdf',
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(1024, 2_000_000),
        ];
    }
}
