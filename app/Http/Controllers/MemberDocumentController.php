<?php

namespace App\Http\Controllers;

use App\Http\Requests\Members\StoreMemberDocumentRequest;
use App\Models\Member;
use App\Models\MemberDocument;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MemberDocumentController extends Controller
{
    public function store(StoreMemberDocumentRequest $request, Member $member): RedirectResponse
    {
        $file = $request->file('file');
        $path = $file->store('members/documents', 'public');

        $member->documents()->create([
            'name' => $request->string('name')->toString() ?: $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Document uploaded.']);

        return back();
    }

    public function destroy(Member $member, MemberDocument $document): RedirectResponse
    {
        $this->authorize('update', $member);

        abort_unless($document->member_id === $member->id, 404);

        $document->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Document removed.']);

        return back();
    }
}
