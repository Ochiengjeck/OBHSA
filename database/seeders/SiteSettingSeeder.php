<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Seed the OBHSA business identity and default site settings.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'business_name', 'value' => 'Optimum Baseline Healthcare Staffing Agency (OBHSA)', 'type' => 'text', 'group' => 'general'],
            ['key' => 'business_short_name', 'value' => 'OBHSA', 'type' => 'text', 'group' => 'general'],
            ['key' => 'tagline', 'value' => 'Flexible Shifts. Trusted Facilities. Better Care.', 'type' => 'text', 'group' => 'general'],
            ['key' => 'address', 'value' => '77 Garden Drive Apt 9, Manchester, NH 03102', 'type' => 'textarea', 'group' => 'contact'],
            ['key' => 'email', 'value' => 'Linecrew@Baseline.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'phone', 'value' => '(603) 600-1427', 'type' => 'phone', 'group' => 'contact'],
            ['key' => 'logo_path', 'value' => null, 'type' => 'image', 'group' => 'branding'],
            ['key' => 'facebook_url', 'value' => null, 'type' => 'url', 'group' => 'social'],
            ['key' => 'linkedin_url', 'value' => null, 'type' => 'url', 'group' => 'social'],
            ['key' => 'twitter_url', 'value' => null, 'type' => 'url', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => null, 'type' => 'url', 'group' => 'social'],
            ['key' => 'footer_note', 'value' => 'Optimum Baseline Healthcare Staffing Agency is a per-diem healthcare staffing partner serving facilities and caregivers across New Hampshire.', 'type' => 'textarea', 'group' => 'general'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::query()->updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
