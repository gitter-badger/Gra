<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $this->call('WorldSeeder');
        $this->call('LocationSeeder');
        $this->call('PlaceSeeder');
        $this->call('LocationPlacesSeeder');

        $this->call('WeaponSeeder');
        $this->call('ArmorSeeder');
        $this->call('FoodSeeder');
        $this->call('VehicleSeeder');
        $this->call('SeedSeeder');
        $this->call('StuffSeeder');

        $this->call('ShopSeeder');
        $this->call('WorkSeeder');
        $this->call('QuestSeeder');
        $this->call('NpcSeeder');
        $this->call('InvestmentSeeder');

        if(Config::get('app.debug', false))
            $this->call('DeveloperSeeder');
        
        Model::reguard();
    }
}
