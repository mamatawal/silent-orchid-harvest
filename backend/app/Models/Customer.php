<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Customer extends Model
{
    protected $fillable = ['name', 'email'];

    /**
     * Announcements this customer has read.
     */
    public function readAnnouncements(): BelongsToMany
    {
        return $this->belongsToMany(Announcement::class, 'announcement_customer')
                    ->withPivot('read_at');
    }
}
