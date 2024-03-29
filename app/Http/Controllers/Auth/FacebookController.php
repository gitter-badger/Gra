<?php


namespace HempEmpire\Http\Controllers\Auth;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\World;
use HempEmpire\User;
use Socialite;
use Session;
use Config;
use Auth;

class FacebookController extends Controller
{
	public function getIndex()
	{

		if(Session::has('facebook.id'))
		{
			return view('auth.facebook')
				->with('fbId', Session::get('facebook.id'))
				->with('email', Session::get('facebook.email'));
		}
		else
		{
			return Socialite::driver('facebook')->scopes(['email', 'publish_actions'])->redirect();
		}
	}


	public function getCallback()
	{
		$fbUser = Socialite::driver('facebook')->user();


		if(Session::get('facebook.connect', false) == true)
		{
			$user = Auth::user();

			if(is_null($user->fb_id))
			{
				$user->fb_id = $fbUser->getId();
				$user->premiumPoints += Config::get('user.points.facebook');

				if($user->save())
				{
					$this->success('facebookConnected');
				}
				else
				{
					$this->danger('saveError');
				}
			}
			else
			{
				$this->danger('facebookAlreadyConnected');
			}

			Session::set('facebook.connect', false);

			return redirect()->route('user.index');
		}
		else
		{
			$user = User::where('fb_id', '=', $fbUser->getId())->first();

			if(is_null($user))
			{
				Session::set('facebook.id', $fbUser->getId());
				Session::set('facebook.email', $fbUser->getEmail());

				return redirect('/auth/facebook');
			}
			else
			{
				Auth::login($user);
				Session::set('facebook.token', $fbUser->token);


				if(World::hasSelected())
				{
					return redirect()->route('game');
				}
				else
				{
					return redirect()->route('world.list');
				}
			}
		}
	}
}