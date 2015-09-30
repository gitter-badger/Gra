<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\Quest;
use Formatter;


class QuestController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.quest.list')
            ->with('quests', Quest::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.quest.edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $quest = new Quest();
        $this->modify($quest, $request);
        $quest->save();

        return redirect(route('admin.quest.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($questId)
    {
        return view('admin.quest.view')
            ->with('quest', Quest::findOrFail($questId));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($questId)
    {
        return view('admin.quest.edit')
            ->with('quest', Quest::findOrFail($questId));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($questId, Request $request)
    {
        $quest = Quest::findOrFail($questId);
        $this->modify($quest, $request);
        $quest->save();

        return redirect(route('admin.quest.show', ['quest' => $questId]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($questId)
    {
        Quest::findOrFail($questId)->delete();
        return redirect(route('admin.quest.index'));
    }

    
    private function modify(Quest $quest, Request $request)
    {
        if($request->has('name'))
        {
            $quest->name = $request->input('name');
        }
        if($request->has('repeatable'))
        {
            $quest->repeatable = true;
        }
        else
        {
            $quest->repeatable = false;
        }
        if($request->has('breakable'))
        {
            $quest->breakable = true;
        }
        else
        {
            $quest->breakable = false;
        }
        if($request->has('auto'))
        {
            $quest->auto = true;
        }
        else
        {
            $quest->auto = false;
        }

        if($request->has('daily'))
        {
            $quest->daily = true;
        }
        else
        {
            $quest->daily = false;
        }

        if($request->has('rewards'))
        {
            $quest->rewards = json_encode(explode_trim(PHP_EOL, $request->input('rewards')));
        }
        if($request->has('requires'))
        {
            $quest->requires = json_encode(explode_trim(PHP_EOL, $request->input('requires')));
        }
        if($request->has('objectives'))
        {
            $quest->objectives = json_encode(explode_trim(PHP_EOL, $request->input('objectives')));
        }

        if($request->has('accept'))
        {
            $quest->accept = json_encode(explode_trim(PHP_EOL, $request->input('accept')));
        }
    }

    public function export()
    {
        $output = '[' . PHP_EOL;

        $quests = Quest::all();

        foreach($quests as $quest)
        {
            $output .= "\t'" . $quest->name . '\' => [' . PHP_EOL;

            $output .= "\t\t'breakable' => " . Formatter::stringify($quest->breakable) . ',' . PHP_EOL;
            $output .= "\t\t'repeatable' => " . Formatter::stringify($quest->repeatable) . ',' . PHP_EOL;
            $output .= "\t\t'auto' => " . Formatter::stringify($quest->auto) . ',' . PHP_EOL;
            $output .= "\t\t'daily' => " . Formatter::stringify($quest->daily) . ',' . PHP_EOL;

            $output .= "\t\t'rewards' => " . Formatter::stringify($quest->rewards, true, false) . ',' . PHP_EOL;
            $output .= "\t\t'objectives' => " . Formatter::stringify($quest->objectives, true, false) . ',' . PHP_EOL;
            $output .= "\t\t'accept' => " . Formatter::stringify($quest->accept, true, false) . ',' . PHP_EOL;
            $output .= "\t\t'requires' => " . Formatter::stringify($quest->requires, true, false) . PHP_EOL . "\t]," . PHP_EOL;
        }
        $output .= ']';

        
        $file = fopen(config_path() . '/quests.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);
        
    

        return view('admin.quest.export')
            ->with('output', $output);
    }
}
