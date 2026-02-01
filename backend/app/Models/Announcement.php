<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Announcement extends Model
{
    use HasFactory;

    public const TYPE_CANCELLED = 'cancelled';
    public const TYPE_POSTPONED = 'postponed';

    protected $fillable = [
        'type',
        'title',
        'message',
        'subject_id',
        'for_all_classes',
    ];

    protected $casts = [
        'for_all_classes' => 'boolean',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class, 'announcement_class', 'announcement_id', 'class_id')
            ->select('classes.id', 'classes.name');
    }
}
