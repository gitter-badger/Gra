<?php

namespace HempEmpire\Components;
use HempEmpire\Gang as GangModel;
use HempEmpire\GangMember as MemberModel;
use Request;
use DB;


class Gang extends Component
{

	public function view()
	{
		return view('component.gang')
			->with('gang', $this->player->gang);
	}


	public function actionCreate()
	{
		if(!is_null($this->player->gang))
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
					$gang->reputation = 0;

					if($gang->save())
					{
						$member = new MemberModel;
						$member->gang_id = $gang->id;
						$member->player_id = $this->player->id;
						$member->role = 'boss';
						$member->permissions = MemberModel::PERMISSIONS_ALL;

						return $member->save();
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

}