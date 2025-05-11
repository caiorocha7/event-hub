<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class EventGuestController extends Controller
{
    public function subscribe($eventUuid)
    {
        $user = Auth::guard('api')->user();
        $event = Event::where('uuid_code', $eventUuid)->firstOrFail();

        // Check active subscriptions
        $activeSubscription = EventGuest::where('user_id', $user->id)
            ->whereHas('event', fn($q) => $q->where('is_active', true))
            ->exists();

        if ($activeSubscription) {
            return response()->json([
                'error' => 'Você já está inscrito em um evento ativo'
            ], 422);
        }

        // Check event capacity
        if ($event->guests()->count() >= $event->max_subscription) {
            return response()->json([
                'error' => 'Evento lotado'
            ], 422);
        }

        $subscription = $event->guests()->create([
            'user_id' => $user->id
        ]);

        return response()->json($subscription, 201);
    }

    public function unsubscribe($eventUuid)
    {
        $user = Auth::guard('api')->user();
        $event = Event::where('uuid_code', $eventUuid)->firstOrFail();

        $event->guests()
            ->where('user_id', $user->id)
            ->delete();

        return response()->json(['message' => 'Inscrição cancelada']);
    }
    public function myEvents()
    {
        $user = Auth::guard('api')->user();

        $events = \App\Models\Event::whereHas('guests', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->get();

        return response()->json($events);
    }

}
