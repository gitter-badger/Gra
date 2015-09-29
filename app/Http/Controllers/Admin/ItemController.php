<?php

namespace HempEmpire\Http\Controllers\Admin;

use Request;
use HempEmpire\Http\Controllers\Controller;

use Illuminate\Database\Eloquent\ModelNotFoundException;

use HempEmpire\TemplateArmor;
use HempEmpire\TemplateWeapon;
use HempEmpire\TemplateFood;
use HempEmpire\TemplateSeed;
use HempEmpire\TemplateStuff;
use HempEmpire\TemplateVehicle;
use Formatter;


class ItemController extends Controller
{
    protected $perPage = 25;


    protected function getItemQuery()
    {
        switch($this->type)
        {
            case 'armor':
                return TemplateArmor::query();
            case 'weapon':
                return TemplateWeapon::query();
            case 'food':
                return TemplateFood::query();
            case 'seed':
                return TemplateSeed::query();
            case 'stuff':
                return TemplateStuff::query();
            case 'vehicle':
                return TemplateVehicle::query();
            default:
                return null;
        }
    }


    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $items = $this->getItemQuery()->paginate($this->perPage);

        return view('admin.item.' . $this->type . '.list')
            ->with('type', $this->type)
            ->with('items', $items);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.item.edit')
            ->with('type', $this->type);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $item = null;

        switch($this->type)
        {
            case 'armor':
                $item = new TemplateArmor;
                break;
            case 'weapon':
                $item = new TemplateWeapon;
                break;
            case 'food':
                $item = new TemplateFood;
                break;
            case 'vehicle':
                $item = new TemplateVehicle;
                break;
            case 'seed':
                $item = new TemplateSeed;
                break;
            case 'stuff':
                $item = new TemplateStuff;
                break;
        }

        $this->setItem($item);
        $item->save();

        return redirect(route('admin.item.' . $this->type . '.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $item = $this->getItemQuery()->whereId($id)->firstOrFail();


        return view('admin.item.view')
            ->with('type', $this->type)
            ->with('item', $item);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $item = $this->getItemQuery()->whereId($id)->firstOrFail();


        return view('admin.item.edit')
            ->with('type', $this->type)
            ->with('item', $item);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $item = $this->getItemQuery()->whereId($id)->firstOrFail();

        $this->setItem($item);

        $item->save();

        return redirect(route('admin.item.' . $this->type . '.show', [$this->type => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $this->getItemQuery()->whereId($id)->delete();
        return redirect(route('admin.item.' . $this->type . '.index'));
    }




    protected function setItem($item)
    {
        if(Request::has('name'))
        {
            $item->name = Request::input('name');
        }

        if(Request::hasFile('image') && Request::file('image')->isValid())
        {
            $file = Request::file('image');
            $file->move(public_path() . '/images/items/' . $this->type, $file->getClientOriginalName());
            $item->image = $file->getClientOriginalName();
        }

        if(Request::has('price'))
        {
            $item->price = Request::input('price');
        }

        $item->premium = Request::has('premium');

        if(Request::has('weight'))
        {
            $item->weight = Request::input('weight');
        }

        if(Request::has('requires'))
        {
            $requires = explode_trim(PHP_EOL, Request::input('requires'));

            
            $properties = $item->properties;
            $properties['requires'] = $requires;
            $item->properties = json_encode($properties);
        }

        switch($this->type)
        {
            case 'armor':
                $this->setArmor($item);
                break;
            case 'weapon':
                $this->setWeapon($item);
                break;
            case 'food':
                $this->setFood($item);
                break;
            case 'vehicle':
                $this->setVehicle($item);
                break;
            case 'seed':
                $this->setSeed($item);
                break;
            case 'stuff':
                $this->setStuff($item);
                break;
        }

    }

    protected function setArmor(TemplateArmor $armor)
    {
        if(Request::has('armor'))
        {
            $armor->armor = Request::input('armor');
        }

        if(Request::has('aspeed'))
        {
            $armor->speed = Request::input('aspeed') / 100;
        }
    }

    protected function setWeapon(TemplateWeapon $weapon)
    {
        if(Request::has('damageMin'))
        {
            $weapon->damageMin = Request::input('damageMin');
        }

        if(Request::has('damageMax'))
        {
            $weapon->damageMax = Request::input('damageMax');
        }

        if(Request::has('critChance'))
        {
            $weapon->critChance = Request::input('critChance') / 100;
        }

        if(Request::has('wspeed'))
        {
            $weapon->speed = Request::input('wspeed') / 100;
        }

        if(Request::has('subtype'))
        {
            $weapon->type = Request::input('subtype');
        }
    }

    protected function setFood(TemplateFood $food)
    {
        $food->health = Request::input('health');
        $food->energy = Request::input('energy');
    }

    protected function setSeed(TemplateSeed $seed)
    {
        if(Request::has('growth'))
        {
            $seed->growth = duration_to_time(Request::input('growth'));
        }

        if(Request::has('watering'))
        {
            $seed->watering = duration_to_time(Request::input('watering'));
        }

        if(Request::has('harvestMin'))
        {
            $seed->harvestMin = Request::input('harvestMin');
        }

        if(Request::has('harvestMax'))
        {
            $seed->harvestMax = Request::input('harvestMax');
        }

        if(Request::has('sequality'))
        {
            $seed->quality = Request::input('sequality');
        }
    }

    protected function setStuff(TemplateStuff $stuff)
    {
        if(Request::has('stquality'))
        {
            $stuff->quality = Request::input('stquality') / 100;
        }
    }

    protected function setVehicle(TemplateVehicle $vehicle)
    {
        if(Request::has('vspeed'))
        {
            $vehicle->speed = Request::input('vspeed');
        }

        if(Request::has('cost'))
        {
            $vehicle->cost = Request::input('cost');
        }

        if(Request::has('capacity'))
        {
            $vehicle->capacity = Request::input('capacity');
        }

        if(Request::has('boostable'))
        {
            $vehicle->boostable = true;
        }
    }

    public function export()
    {
        $output = '[' . PHP_EOL;
        $weapons = TemplateWeapon::all();
        $armors = TemplateArmor::all();
        $foods = TemplateFood::all();
        $seeds = TemplateSeed::all();
        $stuffs = TemplateStuff::all();
        $vehicles = TemplateVehicle::all();

        
        if($weapons->count() > 0)
        {
            $output .= "\t'weapons' => [\n";
            
            foreach($weapons as $weapon)
            {
                $output .= "\t\t[\n";
                $output .= "\t\t\t'name' => '" . $weapon->name . "',\n";
                $output .= "\t\t\t'image' => '" . $weapon->image . "',\n";
                $output .= "\t\t\t'price' => " . $weapon->price . ",\n";
                $output .= "\t\t\t'weight' => " . $weapon->weight . ",\n";
                $output .= "\t\t\t'premium' => " . Formatter::stringify($weapon->premium) . ",\n";
                $output .= "\t\t\t'properties' => " . Formatter::stringify($weapon->properties) . ",\n";

                $output .= "\t\t\t'damage' => [" . ($weapon->damageMin) . ', ' . ($weapon->damageMax) .  "],\n";
                $output .= "\t\t\t'critChance' => " . Formatter::number($weapon->critChance, 2) . ",\n";
                $output .= "\t\t\t'speed' => " . Formatter::signed(Formatter::number($weapon->speed, 2)) . ",\n";
                $output .= "\t\t\t'type' => '" . $weapon->type . "',\n";
                $output .= "\t\t],\n";
            }
            $output .= "\t],\n";
        }

        if($armors->count() > 0)
        {
            $output .= "\t'armors' => [\n";
            
            foreach($armors as $armor)
            {
                $output .= "\t\t[\n";
                $output .= "\t\t\t'name' => '" . $armor->name . "',\n";
                $output .= "\t\t\t'image' => '" . $armor->image . "',\n";
                $output .= "\t\t\t'price' => " . $armor->price . ",\n";
                $output .= "\t\t\t'weight' => " . $armor->weight . ",\n";
                $output .= "\t\t\t'premium' => " . Formatter::stringify($armor->premium) . ",\n";
                $output .= "\t\t\t'properties' => " . Formatter::stringify($armor->properties) . ",\n";

                $output .= "\t\t\t'armor' => " . Formatter::number($armor->armor) . ",\n";
                $output .= "\t\t\t'speed' => " . Formatter::signed(Formatter::number($armor->speed, 2)) . ",\n";;
                $output .= "\t\t],\n";
            }
            $output .= "\t],\n";
        }

        if($foods->count() > 0)
        {
            $output .= "\t'foods' => [\n";
            
            foreach($foods as $food)
            {
                $output .= "\t\t[\n";
                $output .= "\t\t\t'name' => '" . $food->name . "',\n";
                $output .= "\t\t\t'image' => '" . $food->image . "',\n";
                $output .= "\t\t\t'price' => " . $food->price . ",\n";
                $output .= "\t\t\t'weight' => " . $food->weight . ",\n";
                $output .= "\t\t\t'premium' => " . Formatter::stringify($food->premium) . ",\n";
                $output .= "\t\t\t'properties' => " . Formatter::stringify($food->properties) . ",\n";

                $output .= "\t\t\t'health' => " . Formatter::stringify($food->health) .  ",\n";
                $output .= "\t\t\t'energy' => " . Formatter::stringify($food->energy) . ",\n";
                $output .= "\t\t],\n";
            }
            $output .= "\t],\n";
        }

        if($seeds->count() > 0)
        {
            $output .= "\t'seeds' => [\n";
            
            foreach($seeds as $seed)
            {
                $output .= "\t\t[\n";
                $output .= "\t\t\t'name' => '" . $seed->name . "',\n";
                $output .= "\t\t\t'image' => '" . $seed->image . "',\n";
                $output .= "\t\t\t'price' => " . $seed->price . ",\n";
                $output .= "\t\t\t'weight' => " . $seed->weight . ",\n";
                $output .= "\t\t\t'premium' => " . Formatter::stringify($seed->premium) . ",\n";
                $output .= "\t\t\t'properties' => " . Formatter::stringify($seed->properties) . ",\n";

                $output .= "\t\t\t'growth' => " . $seed->growth .  ",\n";
                $output .= "\t\t\t'watering' => " . $seed->watering . ",\n";
                $output .= "\t\t\t'harvest' => [" . $seed->harvestMin . ', ' . $seed->harvestMax . "],\n";
                $output .= "\t\t\t'quality' => " . $seed->quality . ",\n";
                $output .= "\t\t],\n";
            }
            $output .= "\t],\n";
        }

        if($stuffs->count() > 0)
        {
            $output .= "\t'stuffs' => [\n";
            
            foreach($stuffs as $stuff)
            {
                $output .= "\t\t[\n";
                $output .= "\t\t\t'name' => '" . $stuff->name . "',\n";
                $output .= "\t\t\t'image' => '" . $stuff->image . "',\n";
                $output .= "\t\t\t'price' => " . $stuff->price . ",\n";
                $output .= "\t\t\t'weight' => " . $stuff->weight . ",\n";
                $output .= "\t\t\t'premium' => " . Formatter::stringify($stuff->premium) . ",\n";
                $output .= "\t\t\t'properties' => " . Formatter::stringify($stuff->properties) . ",\n";

                $output .= "\t\t\t'quality' => " . $stuff->quality .  ",\n";
                $output .= "\t\t],\n";
            }
            $output .= "\t],\n";
        }

        if($vehicles->count() > 0)
        {
            $output .= "\t'vehicles' => [\n";
            
            foreach($vehicles as $vehicle)
            {
                $output .= "\t\t[\n";
                $output .= "\t\t\t'name' => '" . $vehicle->name . "',\n";
                $output .= "\t\t\t'image' => '" . $vehicle->image . "',\n";
                $output .= "\t\t\t'price' => " . $vehicle->price . ",\n";
                $output .= "\t\t\t'weight' => " . $vehicle->weight . ",\n";
                $output .= "\t\t\t'premium' => " . Formatter::stringify($vehicle->premium) . ",\n";
                $output .= "\t\t\t'properties' => " . Formatter::stringify($vehicle->properties) . ",\n";

                $output .= "\t\t\t'speed' => " . $vehicle->speed .  ",\n";
                $output .= "\t\t\t'cost' => " . $vehicle->cost .  ",\n";
                $output .= "\t\t\t'type' => '" . $vehicle->type . "',\n";
                $output .= "\t\t\t'capacity' => " . $vehicle->capacity .  ",\n";
                $output .= "\t\t],\n";
            }
            $output .= "\t],\n";
        }
        $output .= ']';


        $file = fopen(config_path() . '/items.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);



        return view('admin.item.export')
            ->with('output', $output);
    }
}
