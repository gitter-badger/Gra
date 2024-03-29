<?php


class Message
{
	private $name;
	private $type;
	private $args;
	private $at;


	public function __construct($type, $name, $args = [])
	{
		$this->name = $name;
		$this->type = $type;
		$this->args = $args;
	}

	public function render()
	{
		$type = $this->type;
		$content = trans('message.' . $this->name, $this->args);

		return <<<"CONTENT"

<div class="alert alert-$type alert-dismissible" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  $content
</div>

CONTENT;
	}

	public function with($name, $value)
	{
		$this->args[$name] = $value;
		return $this;
	}

	public function ready()
	{
		if(is_null($this->at))
		{
			return true;
		}
		else
		{
			return time() >= $this->at;
		}
	}

	public function delay($time)
	{
		$this->at = time() + $time;
	}

	public function at($time)
	{
		$this->at = $time;
	}



	public function __toString()
	{
		return $this->render();
	}


	public static function success($name, $push = true, $args = [])
	{
		$message = new Message('success', $name, $args);

		if($push)
		{
			Message::push($message);
		}

		return $message;
	}

	public static function warning($name, $push = true, $args = [])
	{
		$message = new Message('warning', $name, $args);

		if($push)
		{
			Message::push($message);
		}

		return $message;
	}

	public static function danger($name, $push = true, $args = [])
	{
		$message = new Message('danger', $name, $args);

		if($push)
		{
			Message::push($message);
		}

		return $message;
	}

	public static function info($name, $push = true, $args = [])
	{
		$message = new Message('info', $name, $args);

		if($push)
		{
			Message::push($message);
		}

		return $message;
	}

	public static function push(Message $message)
	{
		$messages = Session::get('messages', []);
		$messages[] = $message;

		Session::set('messages', $messages);
	}

	public static function poll()
	{
		$messages = Session::get('messages', []);

		foreach($messages as $index => $message)
		{
			if($message->ready())
			{
				unset($messages[$index]);
				Session::set('messages', $messages);

				return $message;
			}
		}

		return null;
	}

	public static function renderAll()
	{
		$buffer = '';
		while(!is_null($message = Message::poll()))
		{
			$buffer .= $message->render();
		}
		return $buffer;
	}
}