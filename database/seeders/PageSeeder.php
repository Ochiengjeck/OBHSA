<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Seed the fixed set of OBHSA pages and their sections.
     */
    public function run(): void
    {
        foreach ($this->pages() as $slug => $page) {
            $record = Page::query()->updateOrCreate(['slug' => $slug], [
                'title' => $page['title'],
                'meta_description' => $page['meta_description'],
                'is_published' => true,
            ]);

            foreach ($page['sections'] as $position => $section) {
                $record->sections()->updateOrCreate(
                    ['type' => $section['type']],
                    ['position' => $position, 'is_visible' => true, 'content' => $section['content']],
                );
            }
        }
    }

    /**
     * @return array<string, array{title: string, meta_description: string, sections: list<array{type: string, content: array<string, mixed>}>}>
     */
    private function pages(): array
    {
        return [
            'home' => [
                'title' => 'Home',
                'meta_description' => 'OBHSA connects per-diem nurses, CNAs, and LPNs with trusted healthcare facilities across New Hampshire.',
                'sections' => [
                    [
                        'type' => 'hero',
                        'content' => [
                            'heading' => 'Flexible Shifts. Trusted Facilities. Better Care.',
                            'subheading' => 'Optimum Baseline Healthcare Staffing Agency connects skilled RNs, LPNs, and CNAs with New Hampshire healthcare facilities that need reliable, compassionate coverage — on your schedule.',
                            'image_path' => null,
                            'primary_cta_label' => 'Find a Shift',
                            'primary_cta_url' => '/jobs',
                            'secondary_cta_label' => 'Request Staffing',
                            'secondary_cta_url' => '/for-facilities',
                        ],
                    ],
                    [
                        'type' => 'intro',
                        'content' => [
                            'heading' => 'Healthcare staffing built around people',
                            'body' => "OBHSA was founded on a simple idea: facilities deserve dependable staff, and caregivers deserve control over their schedules. We carefully screen and credential every caregiver on our roster, then match them with shifts that fit their skills and availability — so facilities get quality coverage and caregivers get the flexibility they're looking for.",
                        ],
                    ],
                    [
                        'type' => 'how_it_works',
                        'content' => [
                            'heading' => 'How OBHSA works',
                            'steps' => [
                                ['title' => 'Apply or request staff', 'description' => 'Caregivers apply once; facilities submit a staffing request describing the roles and shifts they need to fill.'],
                                ['title' => 'We match and credential', 'description' => 'Our team verifies licenses, certifications, and experience, then matches qualified caregivers to open shifts.'],
                                ['title' => 'Coverage, confirmed', 'description' => 'Caregivers pick up shifts that fit their schedule; facilities get dependable coverage backed by OBHSA support.'],
                            ],
                        ],
                    ],
                    [
                        'type' => 'services_list',
                        'content' => [
                            'heading' => 'What we offer',
                            'subheading' => 'Staffing solutions for every care setting, from per-diem shifts to long-term placements.',
                        ],
                    ],
                    [
                        'type' => 'feature_showcase',
                        'content' => [
                            'heading' => 'Why facilities and caregivers choose OBHSA',
                            'subheading' => 'A staffing partner that treats credentialing, scheduling, and support as seriously as you do.',
                            'items' => [
                                [
                                    'title' => 'Every caregiver is fully credentialed',
                                    'body' => 'We verify licenses, certifications, and experience before anyone is matched to a shift, so facilities never have to double-check our work.',
                                    'image_path' => null,
                                ],
                                [
                                    'title' => 'Shifts that fit real schedules',
                                    'body' => 'Caregivers choose the shifts that work for their lives — no forced schedules, no burnout, just dependable coverage on their terms.',
                                    'image_path' => null,
                                ],
                                [
                                    'title' => 'A support team that answers the phone',
                                    'body' => 'Questions about a shift, a credential, or a placement get answered by a real person on our staffing team, not a ticket queue.',
                                    'image_path' => null,
                                ],
                            ],
                        ],
                    ],
                    [
                        'type' => 'stats',
                        'content' => [
                            'heading' => 'Trusted across New Hampshire',
                        ],
                    ],
                    [
                        'type' => 'testimonials',
                        'content' => [
                            'heading' => 'What our caregivers and partners say',
                        ],
                    ],
                    [
                        'type' => 'cta',
                        'content' => [
                            'heading' => 'Ready to get started?',
                            'body' => 'Whether you are a caregiver looking for flexible shifts or a facility that needs reliable coverage, OBHSA is here to help.',
                            'button_label' => 'Browse Open Shifts',
                            'button_url' => '/jobs',
                            'image_path' => null,
                        ],
                    ],
                ],
            ],

            'about' => [
                'title' => 'About Us',
                'meta_description' => 'Learn about Optimum Baseline Healthcare Staffing Agency, a per-diem healthcare staffing partner based in Manchester, NH.',
                'sections' => [
                    [
                        'type' => 'hero',
                        'content' => [
                            'heading' => 'Built on reliability, care, and trust',
                            'subheading' => 'OBHSA is a Manchester, NH-based healthcare staffing agency dedicated to connecting quality caregivers with the facilities that need them most.',
                            'image_path' => null,
                            'primary_cta_label' => 'Meet Our Team',
                            'primary_cta_url' => '/contact',
                            'secondary_cta_label' => null,
                            'secondary_cta_url' => null,
                        ],
                    ],
                    [
                        'type' => 'intro',
                        'content' => [
                            'heading' => 'Our mission',
                            'body' => 'We started OBHSA to close the gap between skilled caregivers looking for flexible work and facilities struggling to keep shifts covered. Every caregiver we place is screened, credentialed, and supported — and every facility partner gets a staffing team that treats their coverage needs as seriously as they do. We believe better staffing means better patient care, and that starts with respecting the people who provide it.',
                        ],
                    ],
                    [
                        'type' => 'gallery',
                        'content' => [
                            'heading' => 'Life at OBHSA',
                            'images' => [
                                ['image_path' => null, 'caption' => 'Our Manchester, NH office team'],
                                ['image_path' => null, 'caption' => 'A caregiver on shift at a partner facility'],
                                ['image_path' => null, 'caption' => 'Credentialing review in progress'],
                                ['image_path' => null, 'caption' => 'OBHSA at a community health event'],
                            ],
                        ],
                    ],
                    [
                        'type' => 'cta',
                        'content' => [
                            'heading' => 'Want to work with us?',
                            'body' => 'Reach out to learn more about joining our caregiver roster or partnering with OBHSA as a facility.',
                            'button_label' => 'Contact Us',
                            'button_url' => '/contact',
                            'image_path' => null,
                        ],
                    ],
                ],
            ],

            'services' => [
                'title' => 'Our Services',
                'meta_description' => 'Explore OBHSA\'s per-diem staffing, travel nursing placement, and facility partnership services.',
                'sections' => [
                    [
                        'type' => 'hero',
                        'content' => [
                            'heading' => 'Staffing solutions for every care setting',
                            'subheading' => 'From same-week per-diem coverage to long-term facility partnerships, OBHSA has a staffing solution that fits.',
                            'image_path' => null,
                            'primary_cta_label' => 'Request Staffing',
                            'primary_cta_url' => '/for-facilities',
                            'secondary_cta_label' => null,
                            'secondary_cta_url' => null,
                        ],
                    ],
                    [
                        'type' => 'cta',
                        'content' => [
                            'heading' => 'Not sure which service fits your needs?',
                            'body' => 'Tell us about your staffing needs and we will recommend the right fit.',
                            'button_label' => 'Get in Touch',
                            'button_url' => '/contact',
                            'image_path' => null,
                        ],
                    ],
                ],
            ],

            'for-facilities' => [
                'title' => 'For Facilities',
                'meta_description' => 'Request reliable, credentialed per-diem healthcare staff for your facility through OBHSA.',
                'sections' => [
                    [
                        'type' => 'hero',
                        'content' => [
                            'heading' => 'Dependable coverage, whenever you need it',
                            'subheading' => 'Submit a staffing request and get matched with credentialed, qualified caregivers ready to fill your open shifts.',
                            'image_path' => null,
                            'primary_cta_label' => 'Request Staffing',
                            'primary_cta_url' => '/contact#staffing-request',
                            'secondary_cta_label' => null,
                            'secondary_cta_url' => null,
                        ],
                    ],
                    [
                        'type' => 'intro',
                        'content' => [
                            'heading' => 'Staffing that keeps up with your census',
                            'body' => 'Call-offs and census swings should not put patient care at risk. OBHSA maintains a roster of pre-screened RNs, LPNs, and CNAs ready to step in — for a single shift or an ongoing placement.',
                        ],
                    ],
                    [
                        'type' => 'how_it_works',
                        'content' => [
                            'heading' => 'Getting covered is simple',
                            'steps' => [
                                ['title' => 'Tell us what you need', 'description' => 'Submit a staffing request with your role, shift, and facility details.'],
                                ['title' => 'We find the match', 'description' => 'Our team matches you with credentialed caregivers who fit your requirements.'],
                                ['title' => 'Confirm and go', 'description' => 'Review the match and confirm — your shift is covered.'],
                            ],
                        ],
                    ],
                    [
                        'type' => 'cta',
                        'content' => [
                            'heading' => 'Ready to request staffing?',
                            'body' => 'Fill out the form below and our team will follow up shortly.',
                            'button_label' => 'Request Staffing',
                            'button_url' => '/contact#staffing-request',
                            'image_path' => null,
                        ],
                    ],
                ],
            ],

            'for-caregivers' => [
                'title' => 'For Caregivers',
                'meta_description' => 'Join the OBHSA caregiver roster and find flexible per-diem RN, LPN, and CNA shifts across New Hampshire.',
                'sections' => [
                    [
                        'type' => 'hero',
                        'content' => [
                            'heading' => 'Work the shifts that work for you',
                            'subheading' => 'Join the OBHSA caregiver roster and pick up flexible per-diem shifts across New Hampshire, on your schedule.',
                            'image_path' => null,
                            'primary_cta_label' => 'Browse Open Shifts',
                            'primary_cta_url' => '/jobs',
                            'secondary_cta_label' => null,
                            'secondary_cta_url' => null,
                        ],
                    ],
                    [
                        'type' => 'intro',
                        'content' => [
                            'heading' => 'Flexibility without sacrificing support',
                            'body' => "Whether you're looking to supplement your income, fill gaps between full-time roles, or build a schedule entirely around per-diem work, OBHSA gives you the flexibility to choose the shifts, facilities, and hours that work for your life.",
                        ],
                    ],
                    [
                        'type' => 'how_it_works',
                        'content' => [
                            'heading' => 'Start working in three steps',
                            'steps' => [
                                ['title' => 'Apply online', 'description' => 'Submit your application and credentials through any open shift listing.'],
                                ['title' => 'Get verified', 'description' => 'Our team reviews your license, certifications, and experience.'],
                                ['title' => 'Pick up shifts', 'description' => 'Browse open shifts and start working on a schedule that fits your life.'],
                            ],
                        ],
                    ],
                    [
                        'type' => 'faq',
                        'content' => [
                            'heading' => 'Frequently asked questions',
                            'items' => [
                                ['question' => 'What credentials do I need?', 'answer' => 'An active NH license or certification (RN, LPN, or CNA) and up-to-date required certifications such as BLS. Our team will confirm exact requirements during onboarding.'],
                                ['question' => 'How quickly can I start working?', 'answer' => 'Most caregivers are credentialed and picking up shifts within one to two weeks of applying, depending on how quickly documentation is submitted.'],
                                ['question' => 'Do I have to commit to a set schedule?', 'answer' => 'No. Per-diem shifts are opt-in — you choose which open shifts to pick up based on your own availability.'],
                                ['question' => 'How and when do I get paid?', 'answer' => 'Caregivers are paid on a weekly basis for all confirmed shifts worked in the prior week.'],
                            ],
                        ],
                    ],
                    [
                        'type' => 'cta',
                        'content' => [
                            'heading' => 'Ready to find your next shift?',
                            'body' => 'Browse open positions and apply in minutes.',
                            'button_label' => 'View Open Shifts',
                            'button_url' => '/jobs',
                            'image_path' => null,
                        ],
                    ],
                ],
            ],

            'contact' => [
                'title' => 'Contact Us',
                'meta_description' => 'Get in touch with Optimum Baseline Healthcare Staffing Agency in Manchester, NH.',
                'sections' => [
                    [
                        'type' => 'hero',
                        'content' => [
                            'heading' => "We're here to help",
                            'subheading' => 'Have a question, a staffing need, or want to join our caregiver roster? Reach out and our team will get back to you shortly.',
                            'image_path' => null,
                            'primary_cta_label' => null,
                            'primary_cta_url' => null,
                            'secondary_cta_label' => null,
                            'secondary_cta_url' => null,
                        ],
                    ],
                    [
                        'type' => 'contact_info',
                        'content' => [
                            'heading' => 'Get in touch',
                            'body' => 'Our team typically responds within one business day.',
                        ],
                    ],
                ],
            ],
        ];
    }
}
