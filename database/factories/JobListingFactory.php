<?php

namespace Database\Factories;

use App\Models\JobListing;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<JobListing>
 */
class JobListingFactory extends Factory
{
    /**
     * Role-specific blurbs used to assemble a realistic description and
     * requirements list instead of placeholder Lorem Ipsum text — these
     * listings are public-facing on /jobs.
     *
     * @var array<string, array{article: string, setting: string, duties: string, license: string, certs: string, experience: string}>
     */
    private const array SPECIALTY_DETAILS = [
        'RN' => [
            'article' => 'an',
            'setting' => 'skilled nursing and long-term care facilities',
            'duties' => 'administering medications, coordinating care plans, supervising LPNs and CNAs, and communicating with physicians and families',
            'license' => 'Active, unencumbered New Hampshire RN license (or a multistate compact license)',
            'certs' => 'Current BLS certification',
            'experience' => 'At least 1 year of recent clinical experience preferred',
        ],
        'LPN' => [
            'article' => 'an',
            'setting' => 'skilled nursing facilities and assisted living communities',
            'duties' => 'administering medications, monitoring patient conditions, documenting care, and supporting the RN-led care team',
            'license' => 'Active, unencumbered New Hampshire LPN license',
            'certs' => 'Current BLS certification',
            'experience' => 'Prior experience in long-term or skilled nursing care preferred',
        ],
        'CNA' => [
            'article' => 'a',
            'setting' => 'skilled nursing facilities and assisted living communities',
            'duties' => 'assisting residents with activities of daily living, taking vitals, and supporting nursing staff with day-to-day care',
            'license' => 'Active New Hampshire CNA certification',
            'certs' => 'Current BLS certification preferred',
            'experience' => 'Prior experience in a long-term care setting preferred but not required',
        ],
        'CMA' => [
            'article' => 'a',
            'setting' => 'assisted living communities and residential care facilities',
            'duties' => 'administering routine medications under a supervising nurse, documenting administration, and monitoring for side effects',
            'license' => 'Active New Hampshire Medication Administration Certification',
            'certs' => 'Current BLS certification preferred',
            'experience' => 'Prior experience administering medications in a residential care setting preferred',
        ],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $specialty = fake()->randomElement(array_keys(self::SPECIALTY_DETAILS));
        $details = self::SPECIALTY_DETAILS[$specialty];
        $city = fake()->randomElement(['Manchester', 'Nashua', 'Concord', 'Derry', 'Salem', 'Dover']);
        $shift = fake()->randomElement(['day', 'evening', 'night', 'rotating']);
        $title = "{$specialty} - Per Diem, {$city} NH ".fake()->unique()->numerify('####');

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'specialty' => $specialty,
            'employment_type' => fake()->randomElement(['per-diem', 'prn', 'full-time', 'part-time', 'contract']),
            'location_city' => $city,
            'location_state' => 'NH',
            'shift' => $shift,
            'pay_range_min' => fake()->numberBetween(28, 40),
            'pay_range_max' => fake()->numberBetween(41, 65),
            'description' => "OBHSA is seeking {$details['article']} {$specialty} to pick up per-diem {$shift} shifts at partner facilities in and "
                ."around {$city}, NH, including {$details['setting']}. Responsibilities include {$details['duties']}. "
                .'Shifts are opt-in — accept the ones that fit your schedule, with OBHSA handling credentialing, '
                .'scheduling support, and weekly pay.',
            'requirements' => "- {$details['license']}\n- {$details['certs']}\n- {$details['experience']}\n"
                .'- Reliable transportation to assigned facilities',
            'is_active' => true,
            'posted_at' => now()->subDays(fake()->numberBetween(0, 30)),
            'closes_at' => null,
        ];
    }
}
