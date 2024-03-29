<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\TemplateShop as Shop;
use HempEmpire\TemplateShopDelivery as Delivery;


use HempEmpire\TemplateArmor as Armor;
use HempEmpire\TemplateFood as Food;
use HempEmpire\TemplateSeed as Seed;
use HempEmpire\TemplateStuff as Stuff;
use HempEmpire\TemplateVehicle as Vehicle;
use HempEmpire\TemplateWeapon as Weapon;



class ShopDeliveryController extends Controller
{

    

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create($shopId)
    {
        $shop = Shop::findOrFail($shopId);

        return view('admin.shop.delivery.edit')
            ->with('armors', Armor::all())
            ->with('weapons', Weapon::all())
            ->with('foods', Food::all())
            ->with('seeds', Seed::all())
            ->with('stuffs', Stuff::all())
            ->with('vehicles', Vehicle::all())
            ->with('shop', $shop);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store($shopId, Request $request)
    {
        $shop = Shop::findOrFail($shopId);
        $delivery = new Delivery;


        $type = $request->input('type');
        $itemId = $request->input('item_' . $type);
        $count = $request->input('count');
        $item = null;

        switch($type)
        {
            case 'armor':
                $item = Armor::findOrFail($itemId);
                break;

            case 'weapon':
                $item = Weapon::findOrFail($itemId);
                break;

            case 'food':
                $item = Food::findOrFail($itemId);
                break;

            case 'seed':
                $item = Seed::findOrFail($itemId);
                break;

            case 'stuff':
                $item = Stuff::findOrFail($itemId);
                break;

            case 'vehicle':
                $item = Vehicle::findOrFail($itemId);
                break;
        }

        if(isset($item))
        {
            $delivery->shop()->associate($shop);
            $delivery->item()->associate($item);
            $delivery->count = $count;
            $delivery->save();
        }

        return redirect(route('admin.shop.show', ['shop' => $shopId]));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($shopId, $deliveryId)
    {
        $delivery = Shop::findOrFail($shopId)->deliveries()->findOrFail($deliveryId);

        return view('admin.shop.delivery.view')
            ->with('delivery', $delivery);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($shopId, $deliveryId)
    {
        $delivery = Shop::findOrFail($shopId)->deliveries()->findOrFail($deliveryId);

        return view('admin.shop.delivery.edit')
            ->with('armors', Armor::all())
            ->with('weapons', Weapon::all())
            ->with('foods', Food::all())
            ->with('seeds', Seed::all())
            ->with('stuffs', Stuff::all())
            ->with('vehicles', Vehicle::all())
            ->with('delivery', $delivery);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($shopId, $deliveryId, Request $request)
    {
        $delivery = Shop::findOrFail($shopId)->deliveries()->findOrFail($deliveryId);


        $type = $request->input('type');
        $itemId = $request->input('item_' . $type);
        $count = $request->input('count');
        $item = null;

        switch($type)
        {
            case 'armor':
                $item = Armor::findOrFail($itemId);
                break;

            case 'weapon':
                $item = Weapon::findOrFail($itemId);
                break;

            case 'food':
                $item = Food::findOrFail($itemId);
                break;

            case 'seed':
                $item = Seed::findOrFail($itemId);
                break;

            case 'stuff':
                $item = Stuff::findOrFail($itemId);
                break;

            case 'vehicle':
                $item = Vehicle::findOrFail($itemId);
                break;
        }

        if(isset($item))
        {
            $delivery->item()->associate($item);
            $delivery->count = $count;
            $delivery->save();
        }

        return redirect(route('admin.shop.delivery.show', ['shop' => $shopId, 'delivery' => $deliveryId]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($shopId, $deliveryId)
    {
       Shop::findOrFail($shopId)->deliveries()->findOrFail($deliveryId)->delete();

       return redirect(route('admin.shop.show', ['shop' => $shopId]));
    }
}
