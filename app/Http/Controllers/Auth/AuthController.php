<?php

namespace HempEmpire\Http\Controllers\Auth;

use Auth;
use Config;
use Session;
use Validator;
use HempEmpire\User;
use HempEmpire\World;
use Illuminate\Http\Request;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Jobs\SendVerification;

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
        
        $user = $this->create($request->all(), $request);

        $job = new SendVerification($user);
        $this->dispatch($job);


        $this->success('registrationDone');


        return redirect(route('home'));
    }

    public function postLogin(Request $request)
    {

        $this->validate($request, [
            'l_email' => 'required|email',
            'l_password' => 'required',
        ]);

        $credentials = $this->getCredentials($request);
        Session::set('world', $request->input('world'));

        if (Auth::attempt($credentials, $request->has('l_remember'))) 
        {
            Session::set('user', Auth::user()->id);

            return redirect()->intended(route('game'));
        }



        return redirect()
            ->route('home')
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
            'g-recaptcha-response' => 'required|recaptcha'
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
        $user = User::create([
            'email' => Session::get('facebook.email', $data['r_email']),
            'password' => bcrypt($data['r_password']),
            'newsletter' => isset($data['r_news']) ? true : false,
            'registration_ip' => $request->getClientIp(),
            'premiumPoints' => Session::has('facebook.id') ? Config::get('user.points.facebook') : 0,
            'premiumStart' => null,
            'premiumEnd' => null,
            'admin' => false,
            'verified' => true,
            'token' => str_random(64),
            'fb_id' => Session::has('facebook.id') ? Session::get('facebook.id') : null,
            'language' => array_search($data['r_language'], Config::get('app.languages')) !== false ? $data['r_language'] : Config::get('app.fallback_locale'),
        ]);

        if(!is_null($user))
        {
            Session::forget('facebook.email');
            Session::forget('facebook.id');
        }

        return $user;
    }


    public function verify($token)
    {
        $user = User::where(['token' => $token])->first();

        if(is_null($user))
        {
            $this->danger('wrongUser');
        }
        elseif($user->verified)
        {
            $this->danger('alreadyVerified');
        }
        else
        {
            $user->verified = true;
            $user->save();

            $this->success('userVerified');
        }

        return redirect(route('home'));
    }
}
