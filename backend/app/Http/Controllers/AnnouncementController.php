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
     * Return all customers.
     */
    public function customers(): JsonResponse
    {
        return response()->json(Customer::orderBy('id')->get());
    }
}
