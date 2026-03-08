<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Announcement extends Model
{
    protected $fillable = ['title', 'body'];

    /**
     * Customers who have read this announcement.
     */
    public function readByCustomers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'announcement_customer')
                    ->withPivot('read_at');
    }
}
