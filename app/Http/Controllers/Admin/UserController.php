<?php

namespace HempEmpire\Http\Controllers\Admin;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;

use Auth;
use HempEmpire\User;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.user.list')
            ->with('users', User::query()->paginate(100));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, Request $request)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
    }

    public function login(Request $request)
    {
        $current = Auth::user();
        $user = User::findOrFail($request->input('user'));

        if($current->id == $user->id)
        {
            $this->danger('cannotLoginAsYourself');
        }
        elseif($user->admin)
        {
            $this->danger('cannotLoginAsAdmin');
        }
        else
        {
            Auth::login($user);

            $this->success('loggedAs')
                ->with('name', $user->email);


            return redirect()->route('game');
        }

        return redirect()->back();
    }

    public function ban(Request $request)
    {
        $current = Auth::user();
        $user = User::findOrFail($request->input('user'));

        if($current->id == $user->id)
        {
            $this->danger('cannotBanYourself');
        }
        elseif($user->admin)
        {
            $this->danger('cannotBanAdmin');
        }
        else
        {
            $duration = duration_to_time($request->input('duration'));

            $user->banStart = time();
            $user->banEnd = $user->banStart + $duration;
            $user->banReason = $request->input('reason');

            if($user->save())
            {
                $this->success('userBanned')
                    ->with('name', $user->name);
            }
            else
            {
                $this->danger('saveError');
            }
        }

        return redirect()->back();
    }
}
