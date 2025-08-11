<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory, HasUuids;
    
    protected $fillable = [
        'order_id',
        'type',
        'message',
        'data',
        'prev_status',
        'new_status',
        'read_at',
    ];
    
    protected $casts = [
        'read_at' => 'datetime',
    ];
    
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}