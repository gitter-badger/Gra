<?php

namespace HempEmpire;
use Message;

trait DispatchesMessages
{
	protected function success($name = 'default')
	{
		return Message::success($name);
	}

	protected function warning($name = 'default')
	{
		return Message::warning($name);
	}

	protected function danger($name = 'default')
	{
		return Message::danger($name);
	}

	protected function info($name = 'default')
	{
		return Message::info($name);
	}
}