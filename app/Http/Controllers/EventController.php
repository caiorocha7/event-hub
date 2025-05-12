<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::where('is_active', true)
            ->withCount('guests')
            ->orderBy('starts_at')
            ->get();

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $user = Auth::guard('api')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'zipcode' => 'required|string|size:8',
            'number' => 'required|string|max:20',
            'complement' => 'nullable|string|max:255',
            'starts_at' => 'required|date|after:now',
            'ends_at' => 'required|date|after:starts_at',
            'max_subscription' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // ViaCEP integration
        $cep = $request->zipcode;
        $response = Http::get("https://viacep.com.br/ws/{$cep}/json/");

        if ($response->failed() || isset($response->json()['erro'])) {
            return response()->json(['error' => 'CEP inválido'], 422);
        }

        $addressData = $response->json();

        $event = Event::create([
            'owner_id' => $user->id,
            'uuid_code' => Str::uuid(),
            'name' => $request->name,
            'description' => $request->description,
            'zipcode' => $cep,
            'address' => $addressData['logradouro'] ?? '',
            'complement' => $request->complement,
            'number' => $request->number,
            'city' => $addressData['localidade'] ?? '',
            'state' => $addressData['uf'] ?? '',
            'starts_at' => $request->starts_at,
            'ends_at' => $request->ends_at,
            'max_subscription' => $request->max_subscription,
            'is_active' => true
        ]);

        // Auto-subscribe owner
        $event->guests()->create(['user_id' => $user->id]);

        return response()->json($event, 201);
    }

    public function show($uuid)
    {
        $event = Event::where('uuid_code', $uuid)
            ->with(['guests', 'owner'])
            ->firstOrFail();

        return response()->json($event);
    }

    public function update(Request $request, $uuid)
    {
        $user = Auth::guard('api')->user();
        $event = Event::where('uuid_code', $uuid)->firstOrFail();

        if ($event->owner_id !== $user->id) {
            return response()->json(['error' => 'Acesso não autorizado'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string|size:8',
            'number' => 'sometimes|required|string|max:20',
            'complement' => 'nullable|string|max:255',
            'starts_at' => 'sometimes|required|date|after:now',
            'ends_at' => 'sometimes|required|date|after:starts_at',
            'max_subscription' => 'sometimes|required|integer|min:1',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update address if ZIP changed
        if ($request->has('zipcode')) {
            $cep = $request->zipcode;
            $response = Http::withOptions(['verify' => false])->get("https://viacep.com.br/ws/{$cep}/json/");

            if ($response->failed() || isset($response->json()['erro'])) {
                return response()->json(['error' => 'CEP inválido'], 422);
            }

            $addressData = $response->json();
            $event->update([
                'zipcode' => $cep,
                'address' => $addressData['logradouro'] ?? $event->address,
                'city' => $addressData['localidade'] ?? $event->city,
                'state' => $addressData['uf'] ?? $event->state
            ]);
        }

        $event->update($request->except('zipcode'));

        return response()->json($event);
    }

    public function destroy($uuid)
    {
        $user = Auth::guard('api')->user();
        $event = Event::where('uuid_code', $uuid)->firstOrFail();

        if ($event->owner_id !== $user->id) {
            return response()->json(['error' => 'Acesso não autorizado'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Evento removido com sucesso']);
    }
    public function myEvents()
    {
        $user = Auth::guard('api')->user();

        $events = Event::with(['owner'])
            ->where(function($query) use ($user) {
                $query->where('owner_id', $user->id)
                    ->orWhereHas('guests', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
            })
            ->orderBy('starts_at', 'desc')
            ->get();

        return response()->json($events);
    }
}
