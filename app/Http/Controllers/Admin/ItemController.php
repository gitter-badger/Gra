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
            $file->move(public_path() . '/images/locations', $file->getClientOriginalName());
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

        if(Request::has('cirtChance'))
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
            $output .= "\t'weapons' => [" . PHP_EOL;
            
            foreach($weapons as $weapon)
            {
                $output .= "\t\t[";
                $output .= '\'name\' => \'' . $weapon->name . '\', ';
                $output .= '\'image\' => \'' . $weapon->image . '\', ';
                $output .= '\'price\' => ' . $weapon->price . ', ';
                $output .= '\'premium\' => ' . Formatter::stringify($weapon->premium) . ', ';
                $output .= '\'weight\' => ' . $weapon->weight . ', ';
                $output .= '\'properties\' => ' . Formatter::stringify($weapon->properties) . ', ';

                $output .= '\'damage\' => [' . $weapon->damageMin . ', ' . $weapon->damageMax .  '], ';
                $output .= '\'critChance\' => ' . Formatter::number($weapon->critChance, 2) . ', ';
                $output .= '\'speed\' => ' . Formatter::signed(Formatter::number($weapon->speed, 2)) . ', ';
                $output .= '\'type\' => \'' . $weapon->type . '\'],' . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;
        }

        if($armors->count() > 0)
        {
            $output .= "\t'armors' => [" . PHP_EOL;
            
            foreach($armors as $armor)
            {
                $output .= "\t\t[";
                $output .= '\'name\' => \'' . $armor->name . '\', ';
                $output .= '\'image\' => \'' . $armor->image . '\', ';
                $output .= '\'price\' => ' . $armor->price . ', ';
                $output .= '\'premium\' => ' . Formatter::stringify($armor->premium) . ', ';
                $output .= '\'weight\' => ' . $armor->weight . ', ';
                $output .= '\'properties\' => ' . Formatter::stringify($armor->properties) . ', ';

                $output .= '\'armor\' => ' . Formatter::number($armor->armor) . ', ';
                $output .= '\'speed\' => ' . Formatter::signed(Formatter::number($armor->speed, 2)) . '],' . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;
        }

        if($foods->count() > 0)
        {
            $output .= "\t'foods' => [" . PHP_EOL;
            
            foreach($foods as $food)
            {
                $output .= "\t\t[";
                $output .= '\'name\' => \'' . $food->name . '\', ';
                $output .= '\'image\' => \'' . $food->image . '\', ';
                $output .= '\'price\' => ' . $food->price . ', ';
                $output .= '\'premium\' => ' . Formatter::stringify($food->premium) . ', ';
                $output .= '\'weight\' => ' . $food->weight . ', ';
                $output .= '\'properties\' => ' . Formatter::stringify($food->properties) . ', ';

                $output .= '\'health\' => ' . Formatter::stringify($food->health) .  ', ';
                $output .= '\'energy\' => ' . Formatter::stringify($food->energy) . '],' . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;
        }

        if($seeds->count() > 0)
        {
            $output .= "\t'seeds' => [" . PHP_EOL;
            
            foreach($seeds as $seed)
            {
                $output .= "\t\t[";
                $output .= '\'name\' => \'' . $seed->name . '\', ';
                $output .= '\'image\' => \'' . $seed->image . '\', ';
                $output .= '\'price\' => ' . $seed->price . ', ';
                $output .= '\'premium\' => ' . Formatter::stringify($seed->premium) . ', ';
                $output .= '\'weight\' => ' . $seed->weight . ', ';
                $output .= '\'properties\' => ' . Formatter::stringify($seed->properties) . ', ';

                $output .= '\'growth\' => ' . $seed->growth .  ', ';
                $output .= '\'watering\' => ' . $seed->watering . ', ';
                $output .= '\'harvest\' => [' . $seed->harvestMin . ', ' . $seed->harvestMax . '], ';
                $output .= '\'quality\' => ' . $seed->quality . '],' . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;
        }

        if($stuffs->count() > 0)
        {
            $output .= "\t'stuffs' => [" . PHP_EOL;
            
            foreach($stuffs as $stuff)
            {
                $output .= "\t\t[";
                $output .= '\'name\' => \'' . $stuff->name . '\', ';
                $output .= '\'image\' => \'' . $stuff->image . '\', ';
                $output .= '\'price\' => ' . $stuff->price . ', ';
                $output .= '\'premium\' => ' . Formatter::stringify($stuff->premium) . ', ';
                $output .= '\'weight\' => ' . $stuff->weight . ', ';
                $output .= '\'properties\' => ' . Formatter::stringify($stuff->properties) . ', ';

                $output .= '\'quality\' => ' . $stuff->quality .  '],' . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;
        }

        if($vehicles->count() > 0)
        {
            $output .= "\t'vehicles' => [" . PHP_EOL;
            
            foreach($vehicles as $vehicle)
            {
                $output .= "\t\t[";
                $output .= '\'name\' => \'' . $vehicle->name . '\', ';
                $output .= '\'image\' => \'' . $vehicle->image . '\', ';
                $output .= '\'price\' => ' . $vehicle->price . ', ';
                $output .= '\'premium\' => ' . Formatter::stringify($vehicle->premium) . ', ';
                $output .= '\'weight\' => ' . $vehicle->weight . ', ';
                $output .= '\'properties\' => ' . Formatter::stringify($vehicle->properties) . ', ';

                $output .= '\'speed\' => ' . $vehicle->speed .  ', ';
                $output .= '\'cost\' => ' . $vehicle->cost .  ', ';
                $output .= '\'capacity\' => ' . $vehicle->capacity .  '],' . PHP_EOL;
            }
            $output .= "\t]," . PHP_EOL;
        }
        $output .= ']';

        $file = fopen(config_path() . '/items.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);



        return view('admin.item.export')
            ->with('output', $output);
    }
}
