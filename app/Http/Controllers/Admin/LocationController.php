<?php


namespace HempEmpire\Http\Controllers\Admin;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Location;
use HempEmpire\Place;
use HempEmpire\LocationPlace;
use Request;
use DB;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
    	return view('admin.location.list')
    		->with('locations', Location::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        $places = Place::all();


        return view('admin.location.edit')
            ->with('places', $places);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        DB::transaction(function()
        {
            $location = new Location;
            $location->name = Request::input('name');
            $location->groups = json_encode(explode_trim(',', Request::input('groups')));
            $location->x = Request::input('x');
            $location->y = Request::input('y');

            $file = Request::file('image');
            $file->move(public_path() . '/images/locations', $file->getClientOriginalName());
            $location->image = $file->getClientOriginalName();

            $location->save();


            if(Request::has('places'))
            {
                $places = array_keys(Request::input('places'));

                $location->places()->delete();


                foreach($places as $place_id)
                {
                    $place = new LocationPlace;
                    $place->location_id = $location->id;
                    $place->place_id = $place_id;
                    $place->save();
                }
            }

        });

        return redirect(route('admin.location.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $location = Location::findOrFail($id);


        return view('admin.location.view')
        	->with('location', $location);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $location = Location::findOrFail($id);
        $places = Place::all();


        return view('admin.location.edit')
            ->with('location', $location)
            ->with('places', $places);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        DB::transaction(function() use($id)
        {
            $location = Location::findOrFail($id);

            if(Request::has('name'))
            {
                $location->name = Request::input('name');
            }


            if(Request::hasFile('image') && Request::file('image')->isValid())
            {
                $file = Request::file('image');
                $file->move(public_path() . '/images/locations', $file->getClientOriginalName());
                $location->image = $file->getClientOriginalName();
            }

            if(Request::has('x'))
            {
                $location->x = Request::input('x');
            }

            if(Request::has('y'))
            {
                $location->y = Request::input('y');
            }

            if(Request::has('groups'))
            {
                $location->groups = json_encode(explode_trim(',', Request::input('groups')));
            }

            $location->save();


            if(Request::has('places'))
            {
                $places = array_keys(Request::input('places'));

                $location->places()->delete();


                foreach($places as $place_id)
                {
                    $place = new LocationPlace;
                    $place->location_id = $id;
                    $place->place_id = $place_id;
                    $place->save();
                }
            }

        });

        return redirect(route('admin.location.show', ['location' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        Location::findOrFail($id)->delete();
        LocationPlace::where('location_id', '=', $id)->delete();
        return redirect(route('admin.location.index'));
    }



    public function export()
    {
        $output = '[' . PHP_EOL;
        $locations = Location::all();


        foreach($locations as $location)
        {
            $places = '';
            $groups = '';

            foreach($location->places as $place)
            {
                if(strlen($places) > 0)
                    $places .= ', ';

                $places .= '\'' . $place->name . '\'';
            }

            foreach($location->groups as $group)
            {
                if(strlen($groups) > 0)
                    $groups .= ', ';

                $groups .= '\'' . $group . '\'';
            }

            $output .= "\t";
            $output .= '[';
            $output .= '\'name\' => \'' . $location->name . '\', ';
            $output .= '\'image\' => \'' . $location->image . '\', ';
            $output .= '\'groups\' => [' . $groups . '], ';
            $output .= '\'x\' => ' . $location->x . ', ';
            $output .= '\'y\' => ' . $location->y . ', ';
            $output .= '\'places\' => [' . $places . ']';
            $output .= '],' . PHP_EOL;
        }
        $output .= ']';

        $file = fopen(config_path() . '/locations.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);

        return view('admin.location.export')
            ->with('output', $output);
    }
}