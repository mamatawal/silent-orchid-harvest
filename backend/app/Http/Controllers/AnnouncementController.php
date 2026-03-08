<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Return all unread announcements for a given customer.
     *
     * Generated SQL (example for customer_id = 1):
     *   SELECT * FROM `announcements`
     *   WHERE NOT EXISTS (
     *       SELECT * FROM `announcement_customer`
     *       WHERE `announcements`.`id` = `announcement_customer`.`announcement_id`
     *         AND `announcement_customer`.`customer_id` = 1
     *   )
     *   ORDER BY `created_at` DESC
     */
    public function unread(Request $request): JsonResponse
    {
        $customerId = (int) $request->query('customer_id', 1);

        $unread = Announcement::whereDoesntHave('readByCustomers', function ($query) use ($customerId) {
            $query->where('customer_id', $customerId);
        })->latest()->get();

        return response()->json($unread);
    }

    /**
     * Mark an announcement as read for a specific customer.
     *
     * POST /api/v1/announcements/mark-read
     * Body: { "announcement_id": 2, "customer_id": 1 }
     */
    public function markAsRead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'announcement_id' => ['required', 'integer', 'exists:announcements,id'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
        ]);

        $customer = Customer::findOrFail($validated['customer_id']);
        $announcement = Announcement::findOrFail($validated['announcement_id']);

        // syncWithoutDetaching prevents duplicate pivot rows
        $customer->readAnnouncements()->syncWithoutDetaching([
            $announcement->id => ['read_at' => now()],
        ]);

        return response()->json([
            'message' => 'Announcement marked as read.',
            'customer' => $customer,
            'announcement' => $announcement,
        ]);
    }

    /**
     * Return all announcements.
     */
    public function index(): JsonResponse
    {
        return response()->json(Announcement::orderBy('id')->get());
    }

    /**
     * Return all customers.
     */
    public function customers(): JsonResponse
    {
        return response()->json(Customer::orderBy('id')->get());
    }
}
