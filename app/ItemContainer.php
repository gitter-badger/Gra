<?php 


namespace HempEmpire;
use HempEmpire\Contracts\Item as ItemContract;
use DB;

trait ItemContainer
{
    private function joinItems()
    {
        $arrays = func_get_args();
        $result = collect([]);

        foreach($arrays as $array)
        {
            foreach($array as $item)
                $result->push($item);
        }

        return $result;
    }




    public function weapons()
    {
        return $this->morphMany(Weapon::class, 'owner');
    }

    public function armors()
    {
        return $this->morphMany(Armor::class, 'owner');
    }

    public function foods()
    {
        return $this->morphMany(Food::class, 'owner');
    }

    public function vehicles()
    {
        return $this->morphMany(Vehicle::class, 'owner');
    }

    public function seeds()
    {
        return $this->morphMany(Seed::class, 'owner');
    }

    public function stuffs()
    {
        return $this->morphMany(Stuff::class, 'owner');
    }






    public function getItems()
    {
        $weapons = $this->getWeapons();
        $armors = $this->getArmors();
        $foods = $this->getFoods();
        $vehicles = $this->getVehicles();
        $seeds = $this->getSeeds();
        $stuffs = $this->getStuffs();

        return $this->joinItems($weapons, $armors, $foods, $vehicles, $seeds, $stuffs);
    }

    public function getWeapons()
    {
        return $this->weapons()->where('count', '>', 0)->with('template')->get();
    }

    public function getArmors()
    {
        return $this->armors()->where('count', '>', 0)->with('template')->get();
    }

    public function getFoods()
    {
        return $this->foods()->where('count', '>', 0)->with('template')->get();
    }

    public function getVehicles()
    {
        return $this->vehicles()->where('count', '>', 0)->with('template')->get();
    }

    public function getSeeds()
    {
        return $this->seeds()->where('count', '>', 0)->with('template')->get();
    }

    public function getStuffs()
    {
        return $this->stuffs()->where('count', '>', 0)->with('template')->get();
    }



    public function getWeaponsCount()
    {
        return $this->weapons()->sum('count');
    }

    public function getArmorsCount()
    {
        return $this->armors()->sum('count');
    }

    public function getFoodsCount()
    {
        return $this->foods()->sum('count');
    }

    public function getVehiclesCount()
    {
        return $this->vehicles()->sum('count');
    }

    public function getSeedsCount()
    {
        return $this->seeds()->sum('count');
    }

    public function getStuffsCount()
    {
        return $this->stuffs()->sum('count');
    }

    private $_weight;
    public function getWeight()
    {
        if(empty($this->_weight))
        {
            $this->_weight = 0.0;
            $items = $this->getItems();


            foreach($items as $item)
                $this->_weight += $item->getWeight() * $item->getCount();
        }

        return $this->_weight;
    }




    public function getUniqueWeaponsCount()
    {
        return $this->weapons()->where('count', '>', 0)->count();
    }

    public function getUniqueArmorsCount()
    {
        return $this->armors()->where('count', '>', 0)->count();
    }

    public function getUniqueFoodsCount()
    {
        return $this->foods()->where('count', '>', 0)->count();
    }

    public function getUniqueVehiclesCount()
    {
        return $this->vehicles()->where('count', '>', 0)->count();
    }

    public function getUniqueSeedsCount()
    {
        return $this->seeds()->where('count', '>', 0)->count();
    }

    public function getUniqueStuffsCount()
    {
        return $this->stuffs()->where('count', '>', 0)->count();
    }



    public function deleteItems()
    {  
        DB::transaction(function()
        {
            if(isset($this->_weight))
                $this->_weight = 0.0;

            $this->weapons()->update(['count' => 0]);
            $this->armors()->update(['count' => 0]);
            $this->foods()->update(['count' => 0]);
            $this->vehicles()->update(['count' => 0]);
            $this->seeds()->update(['count' => 0]);
            $this->stuffs()->update(['count' => 0]);
        });
    }

    public function giveItem(ItemContract $item, $count)
    {
        if(method_exists($this, 'getCapacity'))
        {
            $weight = $item->getWeight();

            if($weight > 0)
            {
                $space = $this->getCapacity() - $this->getWeight();
                $count = min($count, $space / $weight);
            }
        }

        if(isset($this->_weight))
        {
            $this->_weight += $item->getWeight() * $count;
        }


        $type = $item->getType();
        $item->useRawValues(true);

        if($type == 'weapon')
        {
            $weapon = $this->findItemByTemplate($type, $item->getTemplate());

            if(is_null($weapon))
            {
                $weapon = new Weapon;
                $weapon->template_id = $item->getTemplate();
                $weapon->count = 0;
                $weapon->owner()->associate($this);
            }

            $weapon->count += $count;
            return $weapon->save();
        }
        elseif($type == 'armor')
        {
            $armor = $this->findItemByTemplate($type, $item->getTemplate());

            if(is_null($armor))
            {
                $armor = new Armor;
                $armor->template_id = $item->getTemplate();
                $armor->count = 0;
                $armor->owner()->associate($this);
            }

            $armor->count += $count;
            return $armor->save();
        }
        elseif($type == 'food')
        {
            $food = $this->findItemByTemplate($type, $item->getTemplate());

            if(is_null($food))
            {
                $food = new Food;
                $food->template_id = $item->getTemplate();
                $food->count = 0;
                $food->owner()->associate($this);
            }

            $food->count += $count;
            return $food->save();
        }
        elseif($type == 'vehicle')
        {
            $vehicle = $this->findItemByAttrs($type, [

                'template_id' => $item->getTemplate(),
                'speed' => $item->getSpeed(),
                'cost' => $item->getCost(),
                'capacity' => $item->getCapacity(),
            ]);

            if(is_null($vehicle))
            {
                $vehicle = new Vehicle;
                $vehicle->template_id = $item->getTemplate();
                $vehicle->count = 0;
                $vehicle->speed = $item->getSpeed();
                $vehicle->cost = $item->getCost();
                $vehicle->capacity = $item->getCapacity();
                $vehicle->owner()->associate($this);
            }

            $vehicle->count += $count;
            return $vehicle->save();
        }
        elseif($type == 'seed')
        {
            $seed = $this->findItemByAttrs($type, [

                'template_id' => $item->getTemplate(),
                'growth' => $item->getGrowth(),
                'watering' => $item->getWatering(),
                'harvestMin' => $item->getMinHarvest(),
                'harvestMax' => $item->getMaxHarvest(),
                'quality' => $item->getQuality(),
            ]);

            if(is_null($seed))
            {
                $seed = new Seed;
                $seed->template_id = $item->getTemplate();
                $seed->count = 0;
                $seed->growth = $item->getGrowth();
                $seed->watering = $item->getWatering();
                $seed->harvestMin = $item->getMinHarvest();
                $seed->harvestMax = $item->getMaxHarvest();
                $seed->quality = $item->getQuality();
                $seed->owner()->associate($this);
            }

            $seed->count += $count;
            return $seed->save();
        }
        elseif($type == 'stuff')
        {
            $stuff = $this->findItemByAttrs($type, [

                'template_id' => $item->getTemplate(),
                'quality' => $item->getQuality(),
            ]);

            if(is_null($stuff))
            {
                $stuff = new stuff;
                $stuff->template_id = $item->getTemplate();
                $stuff->count = 0;
                $stuff->quality = $item->getQuality();
                $stuff->owner()->associate($this);
            }

            $stuff->count += $count;
            return $stuff->save();
        }

        $item->useRawValues(false);
        return false;
    }

    public function takeItem(ItemContract $item, $count)
    {
        $type = $item->getType();
        $item->useRawValues(true);

        if(isset($this->_weight))
        {
            $this->_weight -= $item->getWeight() * $count;
        }

        if($type == 'weapon')
        {
            $weapon = $this->findItemByTemplate($type, $item->getTemplate());


            if(!is_null($weapon) && $weapon->count >= $count)
            {
                $weapon->count -= $count;
                return $weapon->save();
            }
        }
        elseif($type == 'armor')
        {
            $armor = $this->findItemByTemplate($type, $item->getTemplate());


            if(!is_null($armor) && $armor->count >= $count)
            {
                $armor->count -= $count;
                return $armor->save();
            }
        }
        elseif($type == 'food')
        {
            $food = $this->findItemByTemplate($type, $item->getTemplate());


            if(!is_null($food) && $food->count >= $count)
            {
                $food->count -= $count;
                return $food->save();
            }
        }
        elseif($type == 'vehicle')
        {
            $vehicle = $this->findItemByAttrs($type, [

                'template_id' => $item->getTemplate(),
                'speed' => $item->getSpeed(),
                'cost' => $item->getCost(),
                'capacity' => $item->getCapacity(),
            ]);


            if(!is_null($vehicle) && $vehicle->count >= $count)
            {
                $vehicle->count -= $count;
                return $vehicle->save();
            }
        }
        elseif($type == 'seed')
        {
            $seed = $this->findItemByAttrs($type, [

                'template_id' => $item->getTemplate(),
                'growth' => $item->getGrowth(),
                'watering' => $item->getWatering(),
                'harvestMin' => $item->getMinHarvest(),
                'harvestMax' => $item->getMaxHarvest(),
                'quality' => $item->getQuality(),
            ]);

     
            if(!is_null($seed) && $seed->count >= $count)
            {
                $seed->count -= $count;
                return $seed->save();
            }
        }
        elseif($type == 'stuff')
        {
            $stuff = $this->findItemByAttrs($type, [

                'template_id' => $item->getTemplate(),
                'quality' => $item->getQuality(),
            ]);

  
            if(!is_null($stuff) && $stuff->count >= $count)
            {
                $stuff->count -= $count;
                return $stuff->save();
            }
        }

        $item->useRawValues(false);
        return false;
    }

    public function findItemById($type, $id)
    {
        if($type == 'weapon')
        {
            return $this->weapons()->whereId($id)->first();
        }
        elseif($type == 'armor')
        {
            return $this->armors()->whereId($id)->first();
        }
        elseif($type == 'food')
        {
            return $this->foods()->whereId($id)->first();
        }
        elseif($type == 'vehicle')
        {
            return $this->vehicles()->whereId($id)->first();
        }
        elseif($type == 'seed')
        {
            return $this->seeds()->whereId($id)->first();
        }
        elseif($type == 'stuff')
        {
            return $this->stuffs()->whereId($id)->first();
        }

        return null;
    }

    public function findItemByAttrs($type, $attrs)
    {
        if($type == 'weapon')
        {
            return $this->weapons()->where($attrs)->first();
        }
        elseif($type == 'armor')
        {
            return $this->armors()->where($attrs)->first();
        }
        elseif($type == 'food')
        {
            return $this->foods()->where($attrs)->first();
        }
        elseif($type == 'vehicle')
        {
            return $this->vehicles()->where($attrs)->first();
        }
        elseif($type == 'seed')
        {
            return $this->seeds()->where($attrs)->first();
        }
        elseif($type == 'stuff')
        {
            return $this->stuffs()->where($attrs)->first();
        }

        return null;
    }

    public function findItemByTemplate($type, $template)
    {
        if($type == 'weapon')
        {
            return $this->weapons()->where('template_id', '=', $template)->first();
        }
        elseif($type == 'armor')
        {
            return $this->armors()->where('template_id', '=', $template)->first();
        }
        elseif($type == 'food')
        {
            return $this->foods()->where('template_id', '=', $template)->first();
        }
        elseif($type == 'vehicle')
        {
            return $this->vehicles()->where('template_id', '=', $template)->first();
        }
        elseif($type == 'seed')
        {
            return $this->seeds()->where('template_id', '=', $template)->first();
        }
        elseif($type == 'stuff')
        {
            return $this->stuffs()->where('template_id', '=', $template)->first();
        }
        else
        {
            return null;
        }
    }

}