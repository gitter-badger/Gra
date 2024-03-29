<?php

namespace HempEmpire\Http\Controllers;
use Illuminate\Http\Request;
use HempEmpire\Player;
use Socialite;
use Session;
use Config;
use Auth;
use Hash;



class UserController extends Controller
{
	protected $user;




	public function __construct()
	{
		$this->user = Auth::user();
	}


	public function getIndex()
	{
		return redirect()->route('user.tutorial');
	}

	public function getTutorial()
	{
		return view('user.tutorial')
			->with('tutorials', $this->user->tutorials);
	}

	public function postTutorial(Request $request)
	{
		$tutorial = $this->user->tutorials()->whereName($request->input('tutorial'))->first();

		if(is_null($tutorial))
		{
			$this->danger('wrongTutorial');
		}
		else
		{
			$action = $request->input('action');

			if($action == 'reset')
			{
				$tutorial->stage = 0;
				$tutorial->save();

				$this->success('tutorialReseted');
			}
			elseif($action == 'enable')
			{
				$tutorial->active = true;
				$tutorial->save();

				$this->success('tutorialEnabled');
			}
			elseif($action == 'disable')
			{
				$tutorial->active = false;
				$tutorial->save();

				$this->success('tutorialDisabled');
			}
			else
			{
				$this->danger('wrongAction');
			}


		}

		return redirect()->route('user.tutorial');
	}






	public function getChange()
	{
		return view('user.change');
	}

	public function postChange(Request $request)
	{
		$this->validate($request, [

			'current_password' => 'required|min:6',
			'new_password' => 'required|confirmed|min:6',
		]);

		$current = $request->input('current_password');
		$new = Hash::make($request->input('new_password'));



		if(!Hash::check($current, $this->user->password))
		{
			return redirect()->back()->withErrors(['current_password' => 'wrongPassword']);
		}
		else
		{
			$this->user->password = $new;

			if($this->user->save())
			{
				$this->success('passwordChanged');
			}
			else
			{
				$this->danger('saveError');
			}
		}

		return redirect()->route('user.change');
	}


	public function getFacebook()
	{
		return view('user.facebook');
	}

	public function postFacebook(Request $request)
	{
		$action = $request->input('action');

		if($action == 'connect')
		{
			if(!is_null($this->user->fb_id))
			{
				$this->danger('facebookAlreadyConnected');
				return redirect()->back();
			}
			else
			{
				Session::set('facebook.connect', true);
				return Socialite::driver('facebook')->redirect();
			}
		}
		elseif($action == 'modify')
		{
			$player = Player::getActive();

			$player->fbAvatar = $request->has('avatar');
			$player->save();

			if($player->fbAvatar)
			{
				$this->success('enabledFacebookAvatar');
			}
			else
			{
				$this->success('disabledFacebookAvatar');
			}

			return redirect()->route('user.facebook');
		}
	}


	public function getLanguage()
	{
		return view('user.language');
	}

	public function postLanguage(Request $request)
	{
		$lang = $request->input('language');


		if(array_search($lang, Config::get('app.languages')) !== false)
		{
			$this->user->language = $lang;

			if($this->user->save())
			{
				$this->success('languageChaged');
			}
			else
			{
				$this->danger('saveError');
			}
		}
		else
		{
			$this->danger('wrongLanguage');
		}

		return redirect()->back();
	}
}