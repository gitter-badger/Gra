<?php
namespace HempEmpire\Http\Controllers\Player;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Player;
use HempEmpire\World;
use HempEmpire\Location;
use Facebook\Facebook;
use Illuminate\Http\Request;
use Session;
use Config;
use Auth;
use DB;

class PlayerController extends Controller
{
	public function __construct()
	{
		$this->middleware('player', ['except' => ['getCreate', 'postCreate', 'doReference']]);
		$this->middleware('noplayer', ['only' => ['getCreate', 'postCreate']]);
	}

	public function getIndex()
	{
		return redirect(route('player.statistics'));
	}


	public function getCreate()
	{
		$avatars = [];

		foreach(Config::get('player.avatars.male') as $avatar)
			$avatars[] = $avatar;

		foreach(Config::get('player.avatars.famale') as $avatar)
			$avatars[] = $avatar;

		return view('player.create')
			->with('points', Config::get('player.start.stats'))
			->with('avatars', $avatars);
	}

	private function getAvatar($index, $default = null)
	{
		$avatars = [];

		foreach(Config::get('player.avatars.male', []) as $avatar)
			$avatars[] = $avatar;

		foreach(Config::get('player.avatars.famale', []) as $avatar)
			$avatars[] = $avatar;

		return isset($avatars[$index]) ? $avatars[$index] : $default;
	}

	public function postCreate(Request $request)
	{
		$user = Auth::user();
		$world = World::getSelected();

		$this->validate($request, [

			'name' => 'unique:players,name,NULL,id,world_id,' . $world->id . '|alpha_num|required|between:4,32',
			'strength' => 'required|integer|min:0',
			'perception' => 'required|integer|min:0',
			'endurance' => 'required|integer|min:0',
			'charisma' => 'required|integer|min:0',
			'intelligence' => 'required|integer|min:0',
			'agility' => 'required|integer|min:0',
		]);

		$token = null;

		do
		{
			$token = str_random(8);
		
		} while(Player::where(['world_id' => $world->id, 'token' => $token])->count());





		$points = Config::get('player.start.stats');

		$points -= $request->input('strength')
			+ $request->input('perception')
			+ $request->input('endurance')
			+ $request->input('charisma')
			+ $request->input('intelligence')
			+ $request->input('agility');

		if($points != 0)
		{
			return redirect()->back()
				->withInput($request->all())
				->withErrors(['points' => trans('error.wrongStatistics')]);
		}
		else
		{
			$player = new Player;
			$player->user_id = $user->id;
			$player->world_id = $world->id;
			$player->location_id = Location::getStartLocation()->id;

			$player->avatar = $this->getAvatar($request->input('avatar'), '0.png');


			$player->name = $request->input('name');
			$player->strength = $request->input('strength');
			$player->perception = $request->input('perception');
			$player->endurance = $request->input('endurance');
			$player->charisma = $request->input('charisma');
			$player->intelligence = $request->input('intelligence');
			$player->agility = $request->input('agility');

			$player->token = $token;

			$player->save();

			return redirect(route('game'));
		}
	}

	public function getStatistics()
	{
		return view('player.statistics');
	}

	public function postStatistics(Request $request)
	{
		$player = Player::getActive();

		$this->validate($request, [

			'strength' => 'required|integer|min:' . $player->strength,
			'perception' => 'required|integer|min:' . $player->perception,
			'endurance' => 'required|integer|min:' . $player->endurance,
			'charisma' => 'required|integer|min:' . $player->charisma,
			'intelligence' => 'required|integer|min:' . $player->intelligence,
			'agility' => 'required|integer|min:' . $player->agility,
		]);

		$strength = $request->input('strength') - $player->strength;
		$perception = $request->input('perception') - $player->perception;
		$endurance = $request->input('endurance') - $player->endurance;
		$charisma = $request->input('charisma') - $player->charisma;
		$intelligence = $request->input('intelligence') - $player->intelligence;
		$agility = $request->input('agility') - $player->agility;

		$sum = $strength + $perception + $endurance + $charisma + $intelligence + $agility;

		if($sum > $player->statisticPoints)
		{
			return redirect()->back()
				->withInput($request->all())
				->withErrors(['points' => trans('error.wrongStatistics')]);
		}
		else
		{
			$player->statisticPoints -= $sum;
			$player->strength += $strength;
			$player->perception += $perception;
			$player->endurance += $endurance;
			$player->charisma += $charisma;
			$player->intelligence += $intelligence;
			$player->agility += $agility;

			if($player->save())
			{
				$this->success('playerUpdated');
			}
			else
			{
				$this->danger('saveError');
			}

			return redirect(route('player.statistics'));
		}
	}

	public function getItems()
	{
		$player = Player::getActive();
		$items = $player->getItems();

		$armor = $player->equipment->armors()->where('count', '>', 0)->first();
		$vehicle = $player->equipment->vehicles()->where('count', '>', 0)->first();
		$weapon = $player->equipment->weapons()->where('count', '>', 0)->first();

		return view('player.items')
			->with('armor', $armor)
			->with('vehicle', $vehicle)
			->with('weapon', $weapon)
			->with('items', $items);
	}

	public function postItems(Request $request)
	{
		$player = Player::getActive();
		$id = $request->input('item');
		$type = $request->input('type');
		$action = $request->input('action');

		$item = $player->findItemById($type, $id);

		if(is_null($item))
		{
			$this->danger('wrongItem');
		}
		elseif($player->isBusy)
		{
			$this->danger('youAreBusy');
		}
		elseif($item->getCount() < 1)
		{
			$this->danger('wrongItem');
		}
		else
		{
			switch($action)
			{
				case 'use':
					$this->useItem($player, $item);
					break;

				case 'equip':
					$this->equipItem($player, $item);
					break;

				case 'drop':
					$this->dropItem($player, $item, $request->input('count', 1));
					break;

				default:
					$this->danger('wrongAction');
					break;
			}
		}

		return redirect()->route('player.items');



		if(!$item->isUsable())
		{
			$this->danger('itemIsNotUsable')
				->with('name', $item->getTitle());
		}
		elseif($player->isBusy)
		{
			$this->danger('characterIsBusy');
		}
		else
		{
			$success = DB::transaction(function() use($player, $item)
			{
				if(!$item->onUse($player))
					return false;

				return $player->takeItem($item, 1);
			});

			if($success)
			{
				$this->success('itemUsed')
					->with('name', $item->getTitle());
			}
			else
			{
				$this->danger('saveError');
			}
		}

		return redirect(route('player.items'));
	}

	protected function useItem($player, $item)
	{
		if(!$item->isUsable())
		{
			$this->danger('itemIsNotUsable')
				->with('name', $item->getTitle());
		}
		else
		{
			$success = DB::transaction(function() use($player, $item)
			{
				if(!$item->onUse($player))
					return false;

				return $player->takeItem($item, 1);
			});

			if($success)
			{
				$this->success('itemUsed')
					->with('name', $item->getTitle());
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	protected function equipItem($player, $item)
	{
		if(!$item->isEquipable())
		{
			$this->danger('itemIsNotEquipable')
				->with('name', $item->getTitle());
		}
		else
		{
			$success = DB::transaction(function() use($player, $item)
			{
				if(!$item->onEquip($player))
					return false;

				return $player->takeItem($item, 1);
			});

			if($success)
			{
				$this->success('itemEquiped')
					->with('name', $item->getTitle());
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	protected function dropItem($player, $item, $count)
	{
		$count = min($count, $item->getCount());

		$success = DB::transaction(function() use($player, $item, $count)
		{
			return $player->takeItem($item, $count);
		});

		if($success)
		{
			$this->success('itemDropped')
				->with('name', $item->getTitle())
				->with('count', $count);
		}
		else
		{
			$this->danger('saveError');
		}
	}


	public function getInvitations()
	{
		$player = Player::getActive();

		if(is_null($player->gang))
		{
			return view('player.invitations')
				->with('invitations', $player->invitations);
		}
		else
		{
			return redirect()->route('player.statistics');
		}
	}

	public function postInvitations(Request $request)
	{
		$player = Player::getActive();
		$invitationId = $request->input('invitation');
		$invitation = $player->invitations()->where('id', '=', $invitationId)->with('gang')->first();



		if(!is_null($player->gang))
		{
			$this->danger('youAlreadyHaveGang');
		}
		elseif(is_null($invitation))
		{
			$this->danger('wrongInvitation');
		}
		else
		{
			if($request->input('action') == 'accept')
			{
				$invitations = $player->invitations()->where('id', '<>', $invitationId)->with('gang')->get();

				$member = new \HempEmpire\GangMember;
				$member->gang_id = $invitation->gang_id;
				$member->player_id = $player->id;
				$member->role = 'newbie';

				$player->gang_id = $invitation->gang_id;


				$success = DB::transaction(function() use($member, $player)
				{
					return $member->save() && $player->save() && $player->invitations()->delete();
				});

				if($success)
				{
					$invitation->gang->newLog('accepted')
						->subject($player)
						->save();

					foreach($invitations as $inv)
						$inv->gang->newLog('rejected')
							->subject($player)
							->save();



					$this->success('invitationAccepted');
					return redirect()->route('player.statistics');
				}
				else
				{
					$this->danger('saveError');
				}
			}
			elseif($request->input('action') == 'reject')
			{
				$success = DB::transaction(function() use($invitation)
				{
					return $invitation->delete();
				});

				if($success)
				{
					$invitation->gang->newLog('rejected')
						->subject($player)
						->save();

					$this->success('invitationRejected');
					return redirect()->route('player.statistics');
				}
				else
				{
					$this->danger('saveError');
				}
			}
			else
			{
				$this->danger('wrongAction');
			}
		}
		return redirect()->route('player.invitations');
	}

	public function getTalents()
	{
		$player = Player::getActive();
		$trees = Config::get('talents', []);

		return view('player.talents')
			->with('player', $player)
			->with('trees', $trees);
	}

	public function postTalents(Request $request)
	{
		$player = Player::getActive();
		$talent = $request->input('talent');
		$talents = Config::get('talents');
		$exists = false;
		$requirements = [];


		foreach($talents as $name => $tree)
		{
			if(array_key_exists($talent, $tree))
			{
				$requirements = Config::get('talents.' . $name . '.' . $talent . '.requires', []);
				$exists = true;
				break;
			}
		}

		$requirements = new \HempEmpire\Requirements($requirements);

		if(!$exists)
		{
			$this->danger('talentDoesNotExists');
		}
		elseif($player->talentPoints < 1)
		{
			$this->danger('notEnoughTalents');
		}
		elseif($player->hasTalent($talent))
		{
			$this->danger('talentAlreadyTaken');
		}
		elseif(!$requirements->check($player))
		{
			$this->danger('requirementsNotMet');
		}
		else
		{
			$success = DB::transaction(function() use($player, $talent)
			{
				$player->talentPoints--;
				return $player->save() && $player->talents()->create(['name' => $talent]);
			});

			if($success)
			{
				$this->success('talentTaken');
			}
			else
			{
				$this->danger('saveError');
			}
		}

		return redirect()->route('player.talents');
	}

	public function getReference()
	{
		$player = Player::getActive();

		return view('player.reference');
	}

	public function doReference($token, Request $request)
	{
		$player = World::getSelected()->players()->where('token', '=', $token)->orWhere('name', '=', $token)->firstOrFail();
		$ip = inet_pton($request->ip());

		$reference = $player->references()->where('request_ip', '=', $ip)->first();

		if(is_null($reference))
		{
			$at = date('Y-m-d H:i:s', 0);

			$reference = new \HempEmpire\PlayerReference;
			$reference->player_id = $player->id;
			$reference->request_ip = $request->ip();
			$reference->updated_at = 0;
		}

		$end = $reference->updated_at->timestamp + Config::get('player.reference.interval');


		if($player->user->registration_ip == $request->ip())
		{
			$this->danger('cantReferenceYourself');
		}
		elseif($end <= time())
		{
			$player->money += Config::get('player.reference.money');

			$success = DB::transaction(function() use($player, $reference)
			{
				return $player->save() && $reference->touch() && $reference->save();
			});

			if($success)
			{
				$this->success('playerDonated');
			}
			else
			{
				$this->danger('saveError');
			}
		}
		else
		{
			$html = '<div class="text-center"><h4>' . trans('player.reference.wait') . '</h4>';
			$html .= entity('timer')->min($reference->updated_at->timestamp)->now(time())->max($end)->reload(false) . '</div>';

			$this->warning()
				->with('content', $html);
		}


		return view('player.refered')
			->with('player', null)
			->with('p', $player);
	}

	public function postReference()
	{
		session_start();
		$player = Player::getActive();

		if(is_null($player->user->fb_id))
		{
			$this->danger('facebookNotConnected');
		}
		else
		{
			$fb = new Facebook([

				'app_id' => Config::get('services.facebook.client_id'),
				'app_secret' => Config::get('services.facebook.client_secret'),
			]);

			$helper = $fb->getRedirectLoginHelper();

			return redirect()->to($helper->getLoginUrl(route('player.publish'), ['email', 'publish_actions']));
		}

		return redirect()->back();
	}

	public function getPublish()
	{
		session_start();
		$player = Player::getActive();

		if(is_null($player->user->fb_id))
		{
			$this->danger('facebookNotConnected');
		}
		else
		{
			$fb = new Facebook([

				'app_id' => Config::get('services.facebook.client_id'),
				'app_secret' => Config::get('services.facebook.client_secret'),
			]);

			$helper = $fb->getRedirectLoginHelper();
			$token = $helper->getAccessToken();

			if(is_null($token))
			{
				$this->danger('wrongToken');
			}
			else
			{
				$this->publish($fb, $player, $token);
			}

		}

		return redirect()->route('player.reference');
	}

	protected function publish(Facebook $fb, Player $player, $token)
	{
		try
		{
			$response = $fb->post('/' . $player->fb_id . '/feed', [

				'link' => route('player.doReference', ['token' => $player->token]),
				'message' => trans('player.reference.title'),
			], $token);

			$this->success('referencePosted');
			return true;
		}
		catch(\Facebook\Exceptions\FacebookResponseException $e)
		{
			$this->danger($e->getMessage());
			return false;
		}
		catch(\Facebook\Exceptions\FacebookSDKException $e)
		{
			$this->danger($e->getMessage());
			return false;
		}
	}


	public function getQuests()
	{
		$player = Player::getActive();


		return view('player.quests')
			->with('quests', $player->quests()->where(['active' => true])->paginate(25));
	}


	public function viewProfile($name)
	{
		$player = World::getSelected()->players()->whereName($name)->firstOrFail();

		return view('player.profile')
			->with('target', $player);
	}
}