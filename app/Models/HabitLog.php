<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HabitLog extends Model
{
    use HasFactory;

    protected $table = 'habit_logs';

    protected $fillable = [
        'user_id',
        'habit_id',
        'completed',
        'date'
    ];

    protected $casts = [
        'completed' => 'boolean',
        'date' => 'date'
    ];

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec Habit
    public function habit()
    {
        return $this->belongsTo(Habit::class);
    }
}