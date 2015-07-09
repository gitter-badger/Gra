<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\Quest;
use HempEmpire\QuestGroup;


class QuestController extends Controller
{

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create($questGroupId)
    {
        return view('admin.quest-group.quest.edit')
            ->with('questGroup', QuestGroup::findOrFail($questGroupId));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store($questGroupId, Request $request)
    {
        $questGroup = QuestGroup::findOrFail($questGroupId);

        $quest = new Quest();
        $quest->group()->associate($questGroup);
        $this->modify($quest, $request);
        $quest->save();

        return redirect(route('admin.questGroup.show', ['questGroup' => $questGroup]));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($questGroupId, $questId)
    {
        return view('admin.quest-group.quest.view')
            ->with('quest', QuestGroup::findOrFail($questGroupId)->quests()->whereId($questId)->firstOrFail());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($questGroupId, $questId)
    {
        return view('admin.quest-group.quest.edit')
            ->with('quest', QuestGroup::findOrFail($questGroupId)->quests()->whereId($questId)->firstOrFail());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($questGroupId, $questId, Request $request)
    {
        $quest = QuestGroup::findOrFail($questGroupId)->quests()->whereId($questId)->firstOrFail();
        $this->modify($quest, $request);
        $quest->save();

        return redirect(route('admin.questGroup.quest.show', ['questGroup' => $questGroupId, 'quest' => $questId]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($questGroupId, $questId)
    {
        QuestGroup::findOrFail($questGroupId)->quests()->whereId($questId)->delete();
        return redirect(route('admin.questGroup.show', ['questGroup' => $questGroup]));
    }

    
    private function modify(Quest $quest, Request $request)
    {
        if($request->has('name'))
        {
            $quest->name = $request->input('name');
        }
        if($request->has('rewards'))
        {
            $quest->rewards = json_encode(explode_trim(PHP_EOL, $request->input('rewards')));
        }
        if($request->has('requires'))
        {
            $quest->requires = json_encode(explode_trim(PHP_EOL, $request->input('requires')));
        }
    }
}
