<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/** Public member verification (requirements 4.4): only name, title, country, status and photo. */
class VerifyController extends Controller
{
    public function __invoke(Request $request, ?string $memberId = null): JsonResponse
    {
        $validated = validator(['memberId' => $memberId ?? $request->query('memberId')], [
            'memberId' => ['required', 'string', 'max:255'],
        ])->validate();

        $m = Member::where('member_id', strtoupper(trim($validated['memberId'])))->whereNotIn('status', ['Rejected'])->first();
        if (! $m) {
            return response()->json(['found' => false, 'message' => 'No member found for this ID.'], 404);
        }

        return response()->json([
            'found' => true,
            'memberId' => $m->member_id,
            'name' => $m->name,
            'title' => $m->title,
            'country' => $m->country,
            'status' => $m->status,
            'photo' => $m->photo && $m->photo_public ? url(Storage::disk('public')->url($m->photo)) : null,
        ]);
    }
}
