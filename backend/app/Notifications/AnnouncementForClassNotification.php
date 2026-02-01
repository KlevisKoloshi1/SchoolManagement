<?php

namespace App\Notifications;

use App\Models\Announcement;
use Illuminate\Notifications\Notification;

class AnnouncementForClassNotification extends Notification
{
    public function __construct(
        public Announcement $announcement,
        public ?string $className = null
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'announcement_for_class',
            'announcement_id' => $this->announcement->id,
            'title' => $this->announcement->title,
            'message' => $this->announcement->message,
            'announcement_type' => $this->announcement->type,
            'class_name' => $this->className,
            'created_at' => $this->announcement->created_at->toIso8601String(),
        ];
    }
}
