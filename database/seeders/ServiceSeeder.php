<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Seed OBHSA's core staffing services.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Per-Diem Staffing',
                'summary' => 'Same-week coverage for single shifts or short-term gaps, filled by credentialed RNs, LPNs, and CNAs.',
                'description' => 'When a call-off or census spike leaves you short-staffed, our per-diem pool is ready to step in. Every caregiver is pre-screened and credentialed, so you can request coverage with confidence — often with as little as 24 hours notice.',
                'icon' => 'CalendarClock',
            ],
            [
                'title' => 'Travel Nursing Placement',
                'summary' => 'Longer-term placements for facilities that need consistent coverage across multiple weeks or months.',
                'description' => 'For extended vacancies or seasonal demand, we place qualified nurses on multi-week assignments, giving your facility continuity of care without the overhead of a permanent hire.',
                'icon' => 'MapPinned',
            ],
            [
                'title' => 'Facility Partnerships',
                'summary' => 'Ongoing staffing partnerships tailored to your facility\'s recurring coverage needs.',
                'description' => 'We work with nursing homes, assisted living communities, hospitals, and home health agencies to build standing staffing plans, so coverage gaps are filled before they become a problem.',
                'icon' => 'HeartHandshake',
            ],
            [
                'title' => 'Credentialing & Compliance Support',
                'summary' => 'Every caregiver we place is license-verified, background-checked, and certification-current.',
                'description' => 'Our credentialing team manages license verification, background checks, and required certifications like BLS, so your facility stays audit-ready without the administrative burden.',
                'icon' => 'ShieldCheck',
            ],
            [
                'title' => 'Long-Term Care Staffing',
                'summary' => 'Dedicated staffing support for skilled nursing and long-term care communities.',
                'description' => 'Long-term care requires consistency and trust. We prioritize matching the same caregivers to your facility over time, so residents see familiar faces and your team sees fewer disruptions.',
                'icon' => 'Building2',
            ],
            [
                'title' => 'Rapid Response Coverage',
                'summary' => 'Urgent, last-minute shift coverage when you need it most.',
                'description' => 'Unexpected call-offs happen. Our rapid response team works to fill urgent shift gaps as quickly as possible, minimizing disruption to patient care.',
                'icon' => 'Siren',
            ],
        ];

        foreach ($services as $position => $service) {
            Service::query()->updateOrCreate(
                ['slug' => Str::slug($service['title'])],
                [...$service, 'position' => $position, 'is_active' => true],
            );
        }
    }
}
