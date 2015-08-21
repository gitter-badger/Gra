<?php

namespace HempEmpire\Components;
use HempEmpire\Npc as NpcModel;
use HempEmpire\PlayerNpc;
use HempEmpire\Quest;
use DB;


class Npc extends Component
{
	protected $npc;


	public function init()
	{
		$npc = NpcModel::whereName($this->getProperty('name'))->first();



		$this->npc = PlayerNpc::firstOrCreate([

			'npc_id' => $npc->id,
			'player_id' => $this->player->id,
			'location_place_id' => $this->getPlaceId(),
		]);



		if(is_null($this->npc->quest))
		{
			$this->npc->quest()->associate($this->rollQuest());
			$this->npc->save();
		}
	}



	protected function rollQuest()
	{
		$quests = Quest::whereIn('name', $this->npc->npc->quests)->get();
		$quest = null;

		while(true)
		{
			$count = count($quests);

			if($count > 0)
			{
				$index = mt_rand(0, $count - 1);
				$quest = $quests[$index];
				$quests->pull($index);
				$quests = $quests->values();



				$pquest = $this->player->quests()->firstOrCreate([

					'player_npc_id' => $this->npc->id,
					'quest_id' => $quest->id,

				]);

				if(!is_null($pquest) && !$pquest->active && ($pquest->repeatable || !$pquest->done))
				{
					return $quest;
				}
			}
			else
			{
				return null;
			}
		}

	}





	public function view()
	{
		//$this->player->pushEvent(new \HempEmpire\DecideDialog);


		
		$quest = $this->player->quests()->where([

			'player_npc_id' => $this->npc->id,
			'quest_id' => $this->npc->quest->id,

		])->first();

		return view('component.npc')
			->with('npc', $this->npc)
			->with('quest', $quest);
	}



	public function actionAccept($request)
	{
		$requirements = $this->npc->quest->getRequirements();


		if(!$requirements->check())
		{
			$this->danger('requirementsNotMet');
		}
		else
		{
			$quest = $this->player->quests()->firstOrNew([

				'player_npc_id' => $this->npc->id,
				'quest_id' => $this->npc->quest->id,
			]);

			if($quest->active)
			{
				$this->danger('questAlreadyTaken');
			}
			else
			{
				$quest->active = true;
				$quest->done = false;
				$quest->states = null;

				if($quest->save())
				{
					$this->success('questTaken')
						->with('name', $quest->getTitle());
				}
				else
				{
					$this->danger('saveError');
				}

			}

		}
	}

	public function actionDecline($request)
	{
		$this->npc->quest()->associate($this->rollQuest());
		
		if($this->npc->save())
		{
			$this->warning('questDeclined')
				->with('name', $this->npc->quest->getTitle());
		}
		else
		{
			$this->danger('saveError');
		}
	}

	public function actionComplete($request)
	{
		$quest = $this->player->quests()->where([

			'player_npc_id' => $this->npc->id,
			'quest_id' => $this->npc->quest->id,

		])->first();


		if(is_null($quest))
		{
			$this->danger('wrongQuest');
		}
		elseif(!$quest->active)
		{
			$this->danger('questInactive');
		}
		elseif($quest->done)
		{
			$this->danger('questDone');
		}
		elseif(!$quest->check())
		{
			$this->danger('questNotDone');
		}
		else
		{
			$quest->done = true;
			$quest->active = false;

			$success = DB::transaction(function() use($quest)
			{
				return $quest->give() && $quest->save();
			});


			if($success)
			{
				$this->success('questCompleted')
					->with('name', $quest->getTitle());
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

	public function actionCancel($request)
	{
		$quest = $this->player->quests()->where([

			'player_npc_id' => $this->npc->id,
			'quest_id' => $this->npc->quest->id,

		])->first();


		if(is_null($quest))
		{
			$this->danger('wrongQuest');
		}
		elseif(!$quest->active)
		{
			$this->danger('questInactive');
		}
		elseif($quest->done)
		{
			$this->danger('questDone');
		}
		elseif(!$quest->breakable)
		{
			$this->danger('questUnbreakable');
		}
		else
		{
			$quest->done = false;
			$quest->active = false;

			$success = DB::transaction(function() use($quest)
			{
				return $quest->save();
			});


			if($success)
			{
				$this->warning('questCanceled')
					->with('name', $quest->getTitle());
			}
			else
			{
				$this->danger('saveError');
			}
		}
	}

}