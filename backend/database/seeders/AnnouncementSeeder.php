<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Customer;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 announcements
        $announcements = [
            [
                'title' => 'Welcome to AnnounceKit',
                'body'  => 'We are excited to have you on board. Explore all the features we have to offer.',
            ],
            [
                'title' => 'New Dashboard Released',
                'body'  => 'Our redesigned dashboard is now live. Enjoy a cleaner, faster experience.',
            ],
            [
                'title' => 'Performance Improvements',
                'body'  => 'We have rolled out significant performance improvements across the platform.',
            ],
            [
                'title' => 'Bug Fix: Notification Delays',
                'body'  => 'An issue causing delayed notifications has been resolved. You will now receive alerts in real time.',
            ],
            [
                'title' => 'Upcoming Maintenance Window',
                'body'  => 'Scheduled maintenance will take place on 15 March 2026 between 02:00–04:00 UTC.',
            ],
        ];

        foreach ($announcements as $data) {
            Announcement::firstOrCreate(['title' => $data['title']], ['body' => $data['body']]);
        }

        // Create 2 customers
        $customers = [
            ['name' => 'Mohammad', 'email' => 'mohammad@example.com'],
            ['name' => 'Awaludin', 'email' => 'awaludin@example.com'],
        ];

        foreach ($customers as $data) {
            Customer::firstOrCreate(['email' => $data['email']], ['name' => $data['name']]);
        }

        // Mark the 1st announcement as "read" by the 1st customer
        $firstCustomer     = Customer::first();
        $firstAnnouncement = Announcement::first();

        // syncWithoutDetaching is idempotent – safe to call on every boot
        $firstCustomer->readAnnouncements()->syncWithoutDetaching([
            $firstAnnouncement->id => ['read_at' => now()],
        ]);
    }
}
