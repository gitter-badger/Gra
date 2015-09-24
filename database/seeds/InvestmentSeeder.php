<?php

use Illuminate\Database\Seeder;



class InvestmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('investments')->insert(Config::get('investments', []));
    }
}
