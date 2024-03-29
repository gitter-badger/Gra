<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\WorkGroup;
use HempEmpire\Work;

class WorkController extends Controller
{

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create($workGroupId)
    {
        return view('admin.work-group.work.edit')
            ->with('workGroup', WorkGroup::findOrFail($workGroupId));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store($workGroupId, Request $request)
    {
        $workGroup = WorkGroup::findOrFail($workGroupId);

        $work = new Work();
        $work->group()->associate($workGroup);
        $this->modify($work, $request);
        $work->save();

        return redirect(route('admin.workGroup.show', ['workGroup' => $workGroup]));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($workGroupId, $workId)
    {
        return view('admin.work-group.work.view')
            ->with('work', WorkGroup::findOrFail($workGroupId)->works()->whereId($workId)->firstOrFail());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $workId
     * @return Response
     */
    public function edit($workGroupId, $workId)
    {
        return view('admin.work-group.work.edit')
            ->with('work', WorkGroup::findOrFail($workGroupId)->works()->whereId($workId)->firstOrFail());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $workId
     * @return Response
     */
    public function update($workGroupId, $workId, Request $request)
    {
        $work = WorkGroup::findOrFail($workGroupId)->works()->whereId($workId)->firstOrFail();

        $this->modify($work, $request);

        $work->save();

        return redirect(route('admin.workGroup.work.show', ['workGroup' => $workGroupId, 'work' => $workId]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $workId
     * @return Response
     */
    public function destroy($workGroupId, $workId)
    {
        WorkGroup::findOrFail($workGroupId)->works()->whereId($workId)->delete();
        return redirect(route('admin.workGroup.show', ['workGroup' => $workGroupId]));
    }


    
    private function modify(Work $work, Request $request)
    {
        if($request->has('name'))
        {
            $work->name = $request->input('name');
        }
        if($request->has('duration'))
        {
            $work->duration = duration_to_time($request->input('duration'));
        }
        if($request->has('costs'))
        {
            $work->costs = json_encode(explode_trim(PHP_EOL, $request->input('costs')));
        }
        if($request->has('rewards'))
        {
            $work->rewards = json_encode(explode_trim(PHP_EOL, $request->input('rewards')));
        }
        if($request->has('requires'))
        {
            $work->requires = json_encode(explode_trim(PHP_EOL, $request->input('requires')));
        }
    }
}
