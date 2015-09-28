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

            $file = Request::file('plan');
            $file->move(public_path() . '/images/plans', $file->getClientOriginalName());
            $location->plan = $file->getClientOriginalName();

            $location->save();

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
        $places = Place::all();


        return view('admin.location.view')
        	->with('location', $location)
            ->with('places', $places);
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


        return view('admin.location.edit')
            ->with('location', $location);
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


            if(Request::hasFile('plan') && Request::file('plan')->isValid())
            {
                $file = Request::file('plan');
                $file->move(public_path() . '/images/plans', $file->getClientOriginalName());
                $location->plan = $file->getClientOriginalName();
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
                $places .= "\t\t\t'{$place->name}' => ['x' => {$place->x}, 'y' => {$place->y}],\n";
            }

            foreach($location->groups as $group)
            {
                if(strlen($groups) > 0)
                    $groups .= ', ';

                $groups .= "'$group'";
            }

            $output .= "\t[\n";
            $output .= "\t\t'name' => '{$location->name}',\n";
            $output .= "\t\t'image' => '{$location->image}',\n";
            $output .= "\t\t'plan' => '{$location->plan}',\n";
            $output .= "\t\t'groups' => [$groups],\n";
            $output .= "\t\t'x' => {$location->x},\n";
            $output .= "\t\t'y' => {$location->y},\n";
            $output .= "\t\t'places' => [\n$places\t\t],\n";
            $output .= "\t],\n";
        }
        $output .= ']';

        $file = fopen(config_path() . '/locations.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);

        return view('admin.location.export')
            ->with('output', $output);
    }
}