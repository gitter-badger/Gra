<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\Npc;
use HempEmpire\Quest;
use Formatter;



class NpcController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.npc.list')
            ->with('npcs', Npc::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.npc.edit')
            ->with('quests', Quest::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $npc = new Npc;

        $this->modify($npc, $request);
        $npc->save();

        return redirect()->route('admin.npc.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $npc = Npc::findOrFail($id);

        return view('admin.npc.view')
            ->with('npc', $npc);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $npc = Npc::findOrFail($id);


        return view('admin.npc.edit')
            ->with('npc', $npc)
            ->with('quests', Quest::all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $npc = Npc::findOrFail($id);

        $this->modify($npc, $request);
        $npc->save();

        return redirect()->route('admin.npc.show', ['npc' => $id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        Npc::findOrFail($id)->delete();
        return redirect()->route('admin.npc.index');
    }


    protected function modify(Npc $npc, Request $request)
    {
        if($request->has('name'))
        {
            $npc->name = $request->input('name');
        }

        if($request->hasFile('image') && $request->file('image')->isValid())
        {
            $file = $request->file('image');
            $file->move(public_path() . '/images/npc', $file->getClientOriginalName());
            $npc->image = $file->getClientOriginalName();
        }

        if($request->has('quest'))
        {
            $quests = [];

            foreach($request->input('quest') as $name => $value)
            {
                $quests[] = $name;
            }

            $npc->quests = json_encode($quests);
        }
    }


    public function export()
    {
        $output = '[' . PHP_EOL;
        $npcs = Npc::all();
    
        foreach($npcs as $npc)
        {
            $output .= "\t'" . $npc->name . '\' => [' . PHP_EOL;
            $output .= "\t\t'image' => '" . $npc->image . '\',' . PHP_EOL;
            $output .= "\t\t'quests' => " . Formatter::stringify($npc->quests) . PHP_EOL;
            $output .= "\t]," . PHP_EOL;
        }
        $output .= ']';


        $file = fopen(config_path() . '/npcs.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);

        return view('admin.npc.export')
            ->with('output', $output);
    }
}
