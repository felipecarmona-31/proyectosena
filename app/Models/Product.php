<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'size',
        'category',
        'price',
        'min_stock',
        'current_stock',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'min_stock' => 'decimal:2',
        'current_stock' => 'decimal:2',
    ];

    public function isLowStock(): bool
    {
        return $this->current_stock <= $this->min_stock;
    }

    public function getTotalValueAttribute(): float
    {
        return $this->current_stock * $this->price;
    }
}