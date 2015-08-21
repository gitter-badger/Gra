<?php

namespace HempEmpire\Components;
use HempEmpire\Gang as GangModel;
use HempEmpire\GangMember as MemberModel;
use HempEmpire\PlayerInvitation as InvitationModel;
use HempEmpire\Jobs\GangBattle;
use TransText;
use Validator;
use Request;
use Config;
use DB;


class Gang extends Component
{

	public function view()
	{
		$view = Request::input('view', null);
		$gang = $this->player->gang;
		$gangs = [];


		if($view === 'attack' && !$this->player->member->can(MemberModel::PERMISSION_ATTACK))
		{
			if($gang->battleIsComming())
			{
				$view = 'battle';
			}
			else
			{
				$view = 'general';
			}
		}

		if($view === 'upgrade' && !$this->player->member->can(MemberModel::PERMISSION_UPGRADE))
		{
			$view = 'general';
		}

		if($view === 'log' && !$this->player->member->can(MemberModel::PERMISSION_LOG))
		{
			$view = 'general';
		}

		if($view === 'battle' && !$gang->battleIsComming())
		{
			$view = 'general';
		}




		if($view !== 'general' && $view !== 'members' && $view !== 'attack' && $view !== 'upgrade' && $view !== 'log' && $view !== 'battle')
		{
			$view = 'general';
		}






		if(!is_null($gang))
		{
			if($this->player->member->can(MemberModel::PERMISSION_ATTACK) && $view == 'attack')
			{
				$threshold = Config::get('gang.threshold');
				$minRespect = $gang->respect * (100 - $threshold) / 100;
				$maxRespect = $gang->respect * (100 + $threshold) / 100;

				$gangs = $this->player->world->gangs()->where('id', '<>', $gang->id)
					->whereBetween('respect', [$minRespect, $maxRespect])->where('endAttack', '<', time())->get();
			}
		}

		return view('component.gang')
			->with('view', $view)
			->with('gang', $this->player->gang)
			->with('gangs', $gangs);
	}


	public function actionCreate($request)
	{
		$rules = [

			'name' => 'required|min:4|max:32|alpha_num',
		];

		$validator = Validator::make($request->all(), $rules);


		if($validator->fails())
		{
			redirect()->withErrors($validator)->withInput()->send();
			return;
		}
		elseif(!is_null($this->player->gang))
		{
			$this->danger('youAlreadyHaveGang');
		}
		else
		{
			$name = Request::input('name');


			if($this->player->world->gangs()->whereName($name)->count() > 0)
			{
				$this->danger('gangAlreadyExists');
			}
			else
			{

				$success = DB::transaction(function() use($name)
				{
					$gang = new GangModel;
					$gang->world_id = $this->player->world->id;
					$gang->name = $name;
					$gang->accomodationLevel = 1;
					$gang->attackLevel = 1;
					$gang->defenseLevel = 1;
					$gang->money = 0;
					$gang->respect = 0;
					$gang->startAttack = $gang->endAttack = time();




					if($gang->save())
					{
						$gang->newLog('created')
							->subject($this->player)
							->save();

						$this->player->gang_id = $gang->id;

						$member = new MemberModel;
						$member->gang_id = $gang->id;
						$member->player_id = $this->player->id;
						$member->role = 'boss';
						$member->joins = false;

						return $member->save() && $this->player->save();
					}
					else
					{
						return false;
					}
				});

				if($success)
				{
					$this->success('gangCreated');
				}
				else
				{
					$this->danger('saveError');
				}


			}
		}

	}



	public function actionInvite()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif(!$this->player->member->can(MemberModel::PERMISSION_INVITE))
		{
			$this->danger('actionDained');
		}
		elseif($this->player->gang->membersCount < $this->player->membersLimit)
		{
			$this->danger('cannotInvateMorePlayers');
		}
		else
		{
			$name = Request::input('name');

			$player = $this->player->world->players()->whereName($name)->first();

			if(is_null($player))
			{
				$this->danger('playerDoesNotExists');
			}
			elseif($this->player->gang->invitations()->where('player_id', '=', $player->id)->count() > 0)
			{
				$this->danger('playerAlreadyInvited');
			}
			elseif($player->level < Config::get('gang.minLevel'))
			{
				$this->danger('playerHasTooLowLevel');
			}
			else
			{
				$invitation = new InvitationModel;
				$invitation->player_id = $player->id;
				$invitation->gang_id = $this->player->gang->id;

				if($invitation->save())
				{
					$this->player->gang->newLog('invited')
						->subject($this->player)
						->param('name', $player->name)
						->save();

					$player->newReport('invitation')
						->param('gang', $this->player->gang->name)
						->param('by', $this->player->name)
						->send();

					$this->success('playerInvited');
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}


	public function actionKick()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif(!$this->player->member->can(MemberModel::PERMISSION_KICK))
		{
			$this->danger('actionDained');
		}
		else
		{		
			$member = $this->player->gang->members()->whereId(Request::input('member'))->first();

			if(is_null($member))
			{
				$this->danger('memberDoesNotExists');
			}
			elseif(!$this->player->member->canModify($member))
			{
				$this->danger('actionDained');
			}
			else
			{
				$player = $member->player;
				$player->gang_id = null;


				$success = DB::transaction(function() use($player, $member)
				{
					return $player->save() && $member->delete();
				});

				if($success)
				{
					$this->player->gang->newLog('kicked')
						->subject($this->player)
						->param('name', $player->name)
						->save();

					$player->newReport('kicked')
						->param('gang', $this->player->gang->name)
						->param('by', $this->player->name)
						->send();

					$this->success('playerKicked');
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}

	public function actionLeave()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		else
		{
			$success = DB::transaction(function()
			{
				$this->player->member()->delete();
				$this->player->gang_id = null;

				return $this->player->save();
			});

			if($success)
			{
				$this->success('gangLeaved');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}


	public function actionPromote()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif(!$this->player->member->can(MemberModel::PERMISSION_PROMOTE))
		{
			$this->danger('actionDained');
		}
		else
		{		
			$member = $this->player->gang->members()->whereId(Request::input('member'))->first();

			if(is_null($member))
			{
				$this->danger('memberDoesNotExists');
			}
			elseif(!$this->player->member->canModify($member))
			{
				$this->danger('actionDained');
			}
			elseif(!$member->canBePromoted())
			{
				$this->danger('memberCanNotBePromoted');
			}
			else
			{
				$member->promote();


				$success = DB::transaction(function() use($member)
				{
					return $member->save();
				});

				if($success)
				{
					$member->player->newReport('promoted')
						->param('role', new TransText('gang.roles.' . $member->role))
						->param('by', $this->player->name)
						->send();

					$this->player->gang->newLog('promoted')
						->subject($this->player)
						->param('name', $member->player->name)
						->param('role', new TransText('gang.roles.' . $member->role))
						->save();

					$this->success('playerPromoted');
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}


	public function actionDemote()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif(!$this->player->member->can(MemberModel::PERMISSION_DEMOTE))
		{
			$this->danger('actionDained');
		}
		else
		{		
			$member = $this->player->gang->members()->whereId(Request::input('member'))->first();

			if(is_null($member))
			{
				$this->danger('memberDoesNotExists');
			}
			elseif(!$this->player->member->canModify($member))
			{
				$this->danger('actionDained');
			}
			elseif(!$member->canBeDemoted())
			{
				$this->danger('memberCanNotBeDemoted');
			}
			else
			{
				$member->demote();


				$success = DB::transaction(function() use($member)
				{
					return $member->save();
				});

				if($success)
				{
					$member->player->newReport('demoted')
						->param('role', new TransText('gang.roles.' . $member->role))
						->param('by', $this->player->name)
						->send();

					$this->player->gang->newLog('demoted')
						->subject($this->player)
						->param('name', $member->player->name)
						->param('role', new TransText('gang.roles.' . $member->role))
						->save();

					$this->success('playerDemoted');
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}

	public function actionCancel()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif(!$this->player->member->can(MemberModel::PERMISSION_INVITE))
		{
			$this->danger('actionDained');
		}
		else
		{
			$invitation = $this->player->gang->invitations()->whereId(Request::input('invitation'))->first();;

			if(is_null($invitation))
			{
				$this->danger('cannotCancelInvitation');
			}
			else
			{
				if($invitation->delete())
				{
					$invitation->player->newReport('invitationCanceled')
						->param('gang', $this->player->gang->name)
						->param('by', $this->player->name)
						->send();


					$this->player->gang->newLog('canceled')
						->subject($this->player)
						->param('name', $invitation->player->name)
						->save();

					$this->success('invitationCanceled');
				}
				else
				{
					$this->danger('saveError');
				}
			}
		}
	}

	public function actionJoin()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif($this->player->gang->endAttack <= time())
		{
			$this->danger('youAreNotAttacking');
		}
		else
		{
			$member = $this->player->gang->members()->where('player_id', '=', $this->player->id)->first();

			if($member->joins)
			{
				$this->danger('alreadyJoined');
			}
			else
			{
				$member->joins = true;

				if($member->save())
				{
					$this->player->gang->newLog($this->player->gang->action . 'Join')
						->subject($this->player)
						->save();

					$this->success('joinedToBattle');
				}
				else
					$this->danger('saveError');
			}
		}
	}

	public function actionAttack()
	{
		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif(!$this->player->member->can(MemberModel::PERMISSION_ATTACK))
		{
			$this->danger('actionDained');
		}
		else
		{
			$gang = $this->player->world->gangs()->whereId(Request::input('gang'))->first();


			if(is_null($gang))
			{
				$this->danger('gankDoesNotExists');
			}
			else
			{
				$threshold = Config::get('gang.threshold');
				$minRespect = $this->player->gang->respect * (100 - $threshold) / 100;
				$maxRespect = $this->player->gang->respect * (100 + $threshold) / 100;

				if($gang->repsect < $minRespect || $gang->respect > $maxRespect)
				{
					$this->danger('wrongGang');
				}
				elseif($gang->endAttack > time())
				{
					$this->danger('wrongGang');
				}
				else
				{
					$battle = new GangBattle;
					$battle->joinRed($this->player->gang);
					$battle->reason('red', (new TransText('gang.attacker'))->with('gang', $gang->name));
					$battle->joinBlue($gang);
					$battle->reason('blue', (new TransText('gang.defender'))->with('gang', $this->player->gang->name));

					$after = Config::get('gang.battleAfter');

					if(Config::get('app.debug', false))
						$after /= 60;


					$now = time();
					$at = $now + $after;
					$date = date('Y-m-d H:i:s', $at);


					$battle->delay($after);

					DB::transaction(function() use($gang, $date, $now, $at)
					{

						foreach($this->player->gang->members as $member)
						{
							$member->player->newReport('gang-attack')
								->param('gang', $gang->name)
								->param('at', $date)
								->send();

							$member->joins = false;
							$member->save();
						}


						foreach($gang->members as $member)
						{
							$member->player->newReport('gang-defend')
								->param('gang', $this->player->gang->name)
								->param('at', $date)
								->send();

							$member->joins = false;
							$member->save();
						}

						$gang->startAttack = $now;
						$gang->endAttack = $at;
						$gang->action = 'defend';

						$this->player->gang->startAttack = $now;
						$this->player->gang->endAttack = $at;
						$this->player->gang->action = 'attack';

						$this->player->member->joins = true;

						$this->player->gang->newLog('attack')
							->subject($this->player)
							->param('name', $gang->name)
							->save();

						$gang->newLog('defend')
							->param('name', $this->player->gang->name)
							->save();


						$gang->save();
						$this->player->gang->save();
						$this->player->member->save();

					});

					$this->dispatch($battle);

					$this->success('battlePlaned');
				}
			}
		}
	}


	public function actionUpgrade()
	{
		$type = Request::input('type');
		$upgradeCost = $type . 'UpgradeCost';
		$level = $type . 'Level';
		$maxLevel = $type . 'MaxLevel';


		//dd($level, $this->player->gang->$level, $maxLevel, $this->player->gang->$maxLevel, $upgradeCost, $this->player->gang->$upgradeCost);


		if(is_null($this->player->gang))
		{
			$this->danger('youDontHaveGang');
		}
		elseif(!$this->player->member->can(MemberModel::PERMISSION_UPGRADE))
		{
			$this->danger('actionDained');
		}
		elseif($type != 'attack' && $type != 'defense' && $type != 'accomodation')
		{
			$this->danger('wrongUpgrade');
		}
		elseif($this->player->gang->$level >= $this->player->gang->$maxLevel)
		{
			$this->danger('maxLevelReached');
		}
		elseif($this->player->gang->money < $this->player->gang->$upgradeCost)
		{
			$this->danger('notEnoughMoney')
				->with('value', $this->player->gang->$upgradeCost);
		}
		else
		{
			$cost = $this->player->gang->$upgradeCost;
			$this->player->gang->money -= $cost;
			$this->player->gang->$level++;

			if($this->player->gang->save())
			{
				$this->player->gang->newLog($type . 'Upgraded')
					->subject($this->player)
					->param('price', $cost)
					->save();


				$this->success('gangUpgrated');
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

}