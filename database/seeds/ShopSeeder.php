<?php

use Illuminate\Database\Seeder;
use HempEmpire\TemplateShop;
use HempEmpire\TemplateShopDelivery;

use HempEmpire\TemplateWeapon;
use HempEmpire\TemplateArmor;
use HempEmpire\TemplateFood;
use HempEmpire\TemplateVehicle;
use HempEmpire\TemplateSeed;
use HempEmpire\TemplateStuff;

class ShopSeeder extends Seeder
{
	protected function findItemByName($name)
	{
        //echo 'Searching for "' . $name . '"' . PHP_EOL;

		$item = TemplateWeapon::whereName($name)->first();

		if(!is_null($item))
			return $item;

        $item = TemplateArmor::whereName($name)->first();

        if(!is_null($item))
            return $item;

        $item = TemplateFood::whereName($name)->first();

        if(!is_null($item))
            return $item;

        $item = TemplateVehicle::whereName($name)->first();

        if(!is_null($item))
            return $item;

        $item = TemplateSeed::whereName($name)->first();

        if(!is_null($item))
            return $item;

        $item = TemplateStuff::whereName($name)->first();

        if(!is_null($item))
            return $item;


        throw new Exception('Item "' . $name . '" not found');
	}

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shops = Config::get('shops');


        foreach($shops as $name => $items)
        {
            $shop = TemplateShop::create(['name' => $name]);

            foreach($items as $name => $count)
            {
                $item = $this->findItemByName($name);

                $delivery = new TemplateShopDelivery;
                $delivery->count = $count;
                $delivery->item()->associate($item);

                $shop->deliveries()->save($delivery);
            }
        }
    }
}
