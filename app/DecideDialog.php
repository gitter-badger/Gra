<?php

namespace HempEmpire;




class DecideDialog extends Dialog
{
	protected $done = false;
	protected $dismissible = false;


	protected function getTitle()
	{
		return 'event';
	}

	protected function getContent()
	{
		return 'content';
	}

}