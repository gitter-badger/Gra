<?php

namespace HempEmpire\Http\Controllers\Admin;
use HempEmpire\Http\Controllers\Controller;

use Illuminate\Http\Request;

use HempEmpire\Cartel;



class CartelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $cartels = Cartel::all();

        return view('admin.cartel.list')
            ->with('cartels', $cartels);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.cartel.edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $cartel = new Cartel;
        $this->modify($request, $cartel);
        $cartel->save();

        return redirect()->route('admin.cartel.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $cartel = Cartel::findOrFail($id);

        return view('admin.cartel.view')
            ->with('cartel', $cartel);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $cartel = Cartel::findOrFail($id);

        return view('admin.cartel.edit')
            ->with('cartel', $cartel);
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
        $cartel = Cartel::findOrFail($id);
        $this->modify($request, $cartel);
        $cartel->save();

        return redirect()->route('admin.cartel.show', ['cartel' => $id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        Cartel::whereId($id)->delete();
        return redirect()->rotue('admin.cartel.index');
    }


    public function export()
    {
        $output = '[' . PHP_EOL;
        $cartels = Cartel::all();
    
        foreach($cartels as $cartel)
        {
            $output .= "\t'" . $cartel->name . '\',' . PHP_EOL;
        }
        $output .= ']';


        $file = fopen(config_path() . '/cartels.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);

        return view('admin.cartel.export')
            ->with('output', $output);
    }

    protected function modify(Request $request, Cartel $cartel)
    {
        if($request->has('name'))
        {
            $cartel->name = $request->input('name');
        }
    }
}
