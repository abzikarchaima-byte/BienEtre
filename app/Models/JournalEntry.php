<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    use HasFactory;

    protected $table = 'journal_entries';

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'mood_level'
    ];

    protected $casts = [
        'mood_level' => 'integer'
    ];

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}