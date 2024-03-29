<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;


use HempEmpire\World;


class WorldController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.world.list')
            ->with('worlds', World::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        $world = new World;
        $world->open = false;
        $world->save();

        return redirect(route('admin.world.edit', ['world' => $world->id]));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $world = World::findOrFail($id);

        return view('admin.world.view')
            ->with('world', $world);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $world = World::findOrFail($id);

        return view('admin.world.edit')
            ->with('world', $world);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, Request $request)
    {
        World::whereId($id)->update([

            'open' => $request->input('open'),
        ]);

        return redirect(route('admin.world.show', ['world' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $world = World::findOrFail($id);

        if($world->population == 0)
        {
            $world->delete();
        }

        return redirect(route('admin.world.index'));
    }
}
