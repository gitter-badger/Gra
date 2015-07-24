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
		$gang = $this->player->gang;
		$gangs = [];

		if(!is_null($gang))
		{
			if($this->player->member->can(MemberModel::PERMISSION_ATTACK))
			{
				$treshold = Config::get('gang.levelTreshold');
				$minLevel = $gang->level - $treshold;
				$maxLevel = $gang->level + $treshold;

				$gangs = $this->player->world->gangs()->where('id', '<>', $gang->id)
					->whereBetween('level', [$minLevel, $maxLevel])->get();
			}
		}

		return view('component.gang')
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
					$gang->level = 1;
					$gang->money = 0;
					$gang->respect = 0;

					if($gang->save())
					{
						$this->player->gang_id = $gang->id;

						$member = new MemberModel;
						$member->gang_id = $gang->id;
						$member->player_id = $this->player->id;
						$member->role = 'boss';

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

					$this->success('invitationCanceled');
				}
				else
				{
					$this->danger('saveError');
				}
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
				if(abs($this->player->gang->level - $gang->level) > Config::get('gang.levelTreshold'))
				{
					$this->danger('wrongGang');
				}
				else
				{
					$battle = new GangBattle;
					$battle->setRedGang($this->player->gang);
					$battle->reason('red', new TransText('gang.attacker'));
					$battle->setBlueGang($gang);
					$battle->reason('blue', new TransText('gang.defender'));

					$after = Config::get('gang.battleAfter');

					if(Config::get('app.debug', false))
						$after /= 60;

					$at = time() + $after;
					$date = date('Y-m-d H:i:s', $at);

					$battle->delay($after);


					foreach($this->player->gang->members as $member)
					{
						$member->player->newReport('gang-attack')
							->param('gang', $gang->name)
							->param('at', $date)
							->send();
					}


					foreach($gang->members as $member)
					{
						$member->player->newReport('gang-defend')
							->param('gang', $this->player->gang->name)
							->param('at', $date)
							->send();
					}

					$this->dispatch($battle);

					$this->success('battlePlaned');
				}
			}
		}
	}

}