<?php

namespace HempEmpire\Http\Controllers\Admin;
use HempEmpire\Http\Controllers\Controller;

use HempEmpire\LocationPlace;
use HempEmpire\Location;
use HempEmpire\Place;
use Illuminate\Http\Request;


class LocationPlaceController extends Controller
{

	public function store($locationId, Request $request)
	{
		$place = LocationPlace::firstOrCreate([

			'location_id' => $locationId,
			'place_id' => $request->input('placeId'), 
		]);

		if(isset($place))
		{
			$place->x = $request->input('x');
			$place->y = $request->input('y');
			$place->save();
		}
	}


	public function update($locationId, $placeId, Request $request)
	{
		LocationPlace::where('location_id', '=', $locationId)
			->where('place_id', '=', $placeId)
			->update([

				'x' => $request->input('x'),
				'y' => $request->input('y'),
		]);
	}

	public function destroy($locationId, $placeId)
	{
		LocationPlace::where('location_id', '=', $locationId)
			->where('place_id', '=', $placeId)
			->delete();
	}
}