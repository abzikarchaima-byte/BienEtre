<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mood extends Model
{
    use HasFactory;

    protected $table = 'moods';

    protected $fillable = [
        'user_id',
        'mood_level',
        'note',
        'date'
    ];

    protected $casts = [
        'date' => 'date',
        'mood_level' => 'integer'
    ];

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}