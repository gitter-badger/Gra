<?php

namespace HempEmpire\Http\Controllers\Admin;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\LocationPlace;
use HempEmpire\Place;
use Request;
use DB;

class PlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $places = Place::all();

        return view('admin.place.list')
            ->with('places', $places);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.place.edit');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $place = new Place;
        $this->modify($place);
        $place->save();



        return redirect(route('admin.place.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $place = Place::findOrFail($id);


        return view('admin.place.view')
            ->with('place', $place);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $place = Place::findOrFail($id);

        return view('admin.place.edit')
            ->with('place', $place);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $place = Place::findOrFail($id);
        $this->modify($place);
        $place->save();


        return redirect(route('admin.place.show', ['place' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        Place::findOrFail($id)->delete();
        LocationPlace::where('place_id', '=', $id)->delete();
        return redirect(route('admin.place.index'));
    }

    protected function modify(Place $place)
    {

        if(Request::has('name'))
        {
            $place->name = Request::input('name');
        }

        if(Request::has('visible'))
        {
            $place->visible = true;
        }
        else
        {
            $place->visible = false;
        }

        if(Request::has('dangerous'))
        {
            $place->dangerous = true;
        }
        else
        {
            $place->dangerous = false;
        }


        if(Request::hasFile('image') && Request::file('image')->isValid())
        {
            $file = Request::file('image');
            $file->move(public_path() . '/images/places', $file->getClientOriginalName());
            $place->image = $file->getClientOriginalName();
        }


        if(Request::has('components') && Request::has('properties'))
        {
            $components = array_keys(Request::input('components'));
            $properties = array_only(Request::input('properties'), $components);

            foreach($properties as &$array)
            {
                $array = array_where($array, function($key, $value)
                {
                    return !is_null($value) && strlen($value) > 0;
                });
            }

            $place->components = json_encode($components);
            $place->properties = json_encode($properties);
        }

        if(Request::has('requires'))
        {
            $place->requires = json_encode(explode_trim(PHP_EOL, Request::input('requires')));
        }
        else
        {
            $place->requires = json_encode([]);
        }


    }

    public function export()
    {
        $output = '[' . PHP_EOL;


        $places = Place::all();


        foreach($places as $place)
        {
            $output .= "\t[" . PHP_EOL;
            $output .= "\t\t'name' => '" . $place->name . '\',' . PHP_EOL;
            $output .= "\t\t'image' => '" . $place->image . '\',' . PHP_EOL;
            $output .= "\t\t'visible' => " . ($place->visible ? 'true' : 'false') . ',' . PHP_EOL;
            $output .= "\t\t'dangerous' => " . ($place->dangerous ? 'true' : 'false') . ',' . PHP_EOL;
            $output .= "\t\t'components' => " . \Formatter::stringify($place->components, true, false) . ',' . PHP_EOL;
            $output .= "\t\t'properties' => " . \Formatter::stringify($place->properties, true, true) . ',' . PHP_EOL;
            $output .= "\t\t'requires' => " . \Formatter::stringify($place->requires, true, false) . PHP_EOL;
            $output .= "\t]," . PHP_EOL;
        }
        $output .= ']';

        $file = fopen(config_path() . '/places.php', 'w');
        fwrite($file, '<?php' . PHP_EOL . PHP_EOL . 'return ' . $output . ';' . PHP_EOL . '?>');
        fclose($file);

        return view('admin.place.export')
            ->with('output', $output);
    }
}
