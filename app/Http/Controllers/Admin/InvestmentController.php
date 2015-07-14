<?php

namespace HempEmpire\Http\Controllers\Admin;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Investment;
use Request;




class InvestmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $investments = Investment::all();

        return view('admin.investment.list')
            ->with('investments', $investments);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.investment.edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $investment = new Investment;
        $this->modify($investment);
        $investment->save();



        return redirect(route('admin.investment.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $investment = Investment::findOrFail($id);


        return view('admin.investment.view')
            ->with('investment', $investment);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $investment = Investment::findOrFail($id);

        return view('admin.investment.edit')
            ->with('investment', $investment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $investment = Investment::findOrFail($id);
        $this->modify($investment);
        $investment->save();


        return redirect(route('admin.investment.show', ['investment' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        Investment::findOrFail($id)->delete();
        return redirect(route('admin.investment.index'));
    }

    protected function modify(investment $investment)
    {
        if(Request::has('name'))
        {
            $investment->name = Request::input('name');
        }


        if(Request::has('baseIncome'))
        {
            $investment->baseIncome = Request::input('baseIncome');
        }

        if(Request::has('incomePerLevel'))
        {
            $investment->incomePerLevel = Request::input('incomePerLevel');
        }

        if(Request::has('baseCapacity'))
        {
            $investment->baseCapacity = Request::input('baseCapacity');
        }

        if(Request::has('capacityPerLevel'))
        {
            $investment->capacityPerLevel = Request::input('capacityPerLevel');
        }

        if(Request::has('upgradeCost'))
        {
            $investment->upgradeCost = Request::input('upgradeCost');
        }

        if(Request::has('maxIncome'))
        {
            $investment->maxIncome = Request::input('maxIncome');
        }

        if(Request::has('maxCapacity'))
        {
            $investment->maxCapacity = Request::input('maxCapacity');
        }

        if(Request::has('time'))
        {
            $investment->time = duration_to_time(Request::input('time'));
        }
    }

    public function export()
    {
        $output = '[' . PHP_EOL;


        $investments = Investment::all();



        foreach($investments as $investment)
        {
            $output .= "\t[" . PHP_EOL;
            $output .= "\t\t'name' => '" . $investment->name . '\',' . PHP_EOL;
            $output .= "\t\t'baseIncome' => " . $investment->baseIncome . ',' . PHP_EOL;
            $output .= "\t\t'incomePerLevel' => " . $investment->incomePerLevel . ',' . PHP_EOL;
            $output .= "\t\t'baseCapacity' => " . $investment->baseCapacity . ',' . PHP_EOL;
            $output .= "\t\t'capacityPerLevel' => " . $investment->capacityPerLevel . ',' . PHP_EOL;
            $output .= "\t\t'upgradeCost' => " . $investment->upgradeCost . ',' . PHP_EOL;
            $output .= "\t\t'maxIncome' => " . $investment->maxIncome . ',' . PHP_EOL;
            $output .= "\t\t'maxCapacity' => " . $investment->maxCapacity . ',' . PHP_EOL;
            $output .= "\t\t'time' => " . $investment->time . PHP_EOL;
            $output .= "\t]," . PHP_EOL;
        }
        $output .= ']';

        $file = fopen(config_path() . '/investments.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);

        return view('admin.investment.export')
            ->with('output', $output);
    }
}
