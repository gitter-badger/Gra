<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\TemplateShop as Shop;


class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.shop.list')
            ->with('shops', Shop::with('deliveries')->paginate(25));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.shop.edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [

            'name' => 'required|string|unique:template_shops',
        ]);


        Shop::create([

            'name' => $request->input('name'),
        ]);

        return redirect(route('admin.shop.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $shop = Shop::with('deliveries')->findOrFail($id);

        return view('admin.shop.view')
            ->with('shop', $shop)
            ->with('deliveries', $shop->deliveries()->paginate(25));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        return view('admin.shop.edit')
            ->with('shop', Shop::with('deliveries')->findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, Request $request)
    {
        $this->validate($request, [

            'name' => 'required|string|unique:template_shops',
        ]);


        Shop::findOrFail($id)->update(['name' => $request->input('name')]);

        return redirect(route('admin.shop.show', ['shop' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        Shop::findOrFail($id)->delete();
        
        return redirect(route('admin.shop.index'));
    }


    public function export()
    {
        $output = '[' . PHP_EOL;
        $shops = Shop::with('deliveries')->get();
    
        foreach($shops as $shop)
        {
            $output .= "\t'" . $shop->name . '\' => [' . PHP_EOL;

            foreach($shop->deliveries as $delivery)
            {
                $output .= "\t\t'" . $delivery->item->name . '\' => ' . $delivery->count . ',' . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;
        }
        $output .= ']';


        $file = fopen(config_path() . '/shops.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);

        return view('admin.shop.export')
            ->with('output', $output);
    }
}
