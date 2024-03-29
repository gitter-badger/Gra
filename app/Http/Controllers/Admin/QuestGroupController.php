<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\QuestGroup;
use Formatter;


class QuestGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.quest-group.list')
            ->with('questGroups', QuestGroup::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.quest-group.edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $questGroup = new QuestGroup;  
        $this->modify($questGroup, $request);
        $questGroup->save();

        return redirect(route('admin.questGroup.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $questGroup = QuestGroup::findOrFail($id);
        $quests = $questGroup->quests()->paginate(25);

        return view('admin.quest-group.view')
            ->with('questGroup', $questGroup)
            ->with('quests', $quests);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        return view('admin.quest-group.edit')
            ->with('questGroup', QuestGroup::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $questGroup = QuestGroup::findOrFail($id);
        $this->modify($questGroup, $request);
        $questGroup->save();

        return redirect(route('admin.questGroup.show', ['questGroup' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        QuestGroup::findOrFail($id)->delete();
        return redirect(route('admin.questGroup.index'));
    }




    protected function modify(QuestGroup $questGroup, Request $request)
    {
        if($request->has('name'))
        {
            $questGroup->name = $request->input('name');
        }
    }




    public function export()
    {
        $output = '[' . PHP_EOL;


        $groups = QuestGroup::with('quests')->get();


        foreach($groups as $group)
        {
            $output .= "\t'" . $group->name . '\' => [' . PHP_EOL;

            foreach($group->quests as $quest)
            {
                $output .= "\t\t'" . $quest->name . '\' => [' . PHP_EOL;
                $output .= "\t\t\t'rewards' => " . Formatter::stringify($quest->rewards, true, false) . ',' . PHP_EOL;
                $output .= "\t\t\t'requires' => " . Formatter::stringify($quest->requires, true, false) . PHP_EOL . "\t\t]," . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;

        }
        $output .= ']';

        
        $file = fopen(config_path() . '/quests.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);
        
    

        return view('admin.quest-group.export')
            ->with('output', $output);
    }
}
