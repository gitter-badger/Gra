<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;


use HempEmpire\WorkGroup;
use Formatter;


class WorkGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.work-group.list')
            ->with('workGroups', WorkGroup::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.work-group.edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        WorkGroup::create([

            'name' => $request->input('name'),
        ]);

        return redirect(route('admin.workGroup.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $workGroup = WorkGroup::findOrFail($id);

        return view('admin.work-group.view')
            ->with('workGroup', $workGroup)
            ->with('works', $workGroup->works()->paginate(25));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $workGroup = WorkGroup::findOrFail($id);

        return view('admin.work-group.edit')
            ->with('workGroup', $workGroup);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, Request $request)
    {
        WorkGroup::whereId($id)->update(['name' => $request->input('name')]);

        return redirect(route('admin.workGroup.show', ['workGroup' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $group = WorkGroup::findOrFail($id);

        $group->works()->delete();
        $group->delete();

        return redirect(route('admin.workGroup.index'));
    }


    public function export()
    {
        $output = '[' . PHP_EOL;


        $groups = WorkGroup::with('works')->get();


        foreach($groups as $group)
        {
            $output .= "\t'" . $group->name . '\' => [' . PHP_EOL;

            foreach($group->works as $work)
            {
                $output .= "\t\t'" . $work->name . '\' => [' . PHP_EOL;
                $output .= "\t\t\t'duration' => " . $work->duration . ',' . PHP_EOL;
                $output .= "\t\t\t'costs' => " . Formatter::stringify($work->costs, true, false) . ',' . PHP_EOL;
                $output .= "\t\t\t'rewards' => " . Formatter::stringify($work->rewards, true, false) . ',' . PHP_EOL;
                $output .= "\t\t\t'requires' => " . Formatter::stringify($work->requires, true, false) . PHP_EOL . "\t\t]," . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;

        }
        $output .= ']';

        
        $file = fopen(config_path() . '/works.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);
        
    

        return view('admin.work-group.export')
            ->with('output', $output);
    }
}
