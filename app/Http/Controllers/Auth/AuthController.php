<?php

namespace HempEmpire\Http\Controllers\Auth;

use Auth;
use Config;
use Session;
use Validator;
use HempEmpire\User;
use Illuminate\Http\Request;
use HempEmpire\Http\Controllers\Controller;

use Request as RequestFacade;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);
    }

    public function getLogin()
    {
        return view('auth.login');
    }

    public function getRegister()
    {
        return view('auth.register');
    }

    public function postRegister(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            $this->throwValidationException(
                $request, $validator
            );
        }
        
        $this->create($request->all(), $request);


        return redirect(route('home'));
    }

    public function postLogin(Request $request)
    {
        $this->validate($request, [
            'l_email' => 'required|email',
            'l_password' => 'required',
        ]);

        $credentials = $this->getCredentials($request);

        if (Auth::attempt($credentials, $request->has('l_remember'))) 
        {
            return redirect()->intended(route('game'));
        }

        return redirect(route('home'))
            ->withInput($request->only('l_email', 'l_remember'))
            ->withErrors([
                'l_email' => trans('error.wrongLoginOrPassword'),
            ]);
    }

    public function getLogout()
    {
        Auth::logout();
        Session::flush();

        return redirect(route('home'));
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function getCredentials(Request $request)
    {
        return [

            'email' => $request->input('l_email'),
            'password' => $request->input('l_password'),
        ];
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'r_email' => 'required|email|max:255|unique:users,email',
            'r_password' => 'required|confirmed|min:6',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data, Request $request)
    {
        return User::create([
            'email' => $data['r_email'],
            'password' => bcrypt($data['r_password']),
            'newsletter' => $data['r_news'],
            'registration_ip' => $request->getClientIp(),
            'premiumPoints' => 0,
            'remiumStart' => null,
            'premiumEnd' => null,
            'admin' => Config::get('app.debug', false),
        ]);
    }
}
