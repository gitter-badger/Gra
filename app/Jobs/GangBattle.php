<?php


namespace HempEmpire\Jobs;



class GangBattle extends Battle
{
	protected $redGang;
	protected $blueGang;

	public function setRedGang($gang)
	{
		$this->redGang = $gang;
	}


	public function setBlueGang($gang)
	{
		$this->blueGang = $gang;
	}

	public function handle()
	{
		foreach($this->redGang->members as $member)
		{
			if(!$member->player->isBusy)
				$this->joinRed($member->player);
		}

		foreach($this->blueGang->members as $member)
		{
			if(!$member->player->isBusy)
				$this->joinBlue($member->player);
		}

		return parent::handle();
	}
}