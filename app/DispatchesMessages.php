<?php

namespace HempEmpire;
use Message;

trait DispatchesMessages
{
	protected function success($name)
	{
		return Message::success($name);
	}

	protected function warning($name)
	{
		return Message::warning($name);
	}

	protected function danger($name)
	{
		return Message::danger($name);
	}

	protected function info($name)
	{
		return Message::info($name);
	}
}