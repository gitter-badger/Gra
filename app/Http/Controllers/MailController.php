<?php 


namespace HempEmpire\Http\Controllers;

use Config;
use HempEmpire\Player;
use HempEmpire\World;
use Illuminate\Http\Request;




class MailController extends Controller
{

	protected $player;
	protected $world;

	public function __construct()
	{
		$this->world = World::getSelected();
		$this->player = player::getActive();
	}



	public function getIndex()
	{
		return redirect(route('message.inbox.index'));
	}

	public function getCreate()
	{
		return view('message.create');
	}

	public function postCreate(Request $request)
	{

		$world = World::get();
		$player = $world->characters()->whereName($request->input('to'))->first();

		if(empty($player))
		{
			return redirect(route('message.create'))
				->withErrors(['to' => trans('error.characterDoesNotExists')]);
		}
		elseif($player->id == $this->player->id)
		{
			return redirect(route('message.create'))
				->withErrors(['to' => trans('error.youCanNotSendToYourself')]);
		}
		elseif($player->blacklist()->where('blocked_id', '=', $this->player->id)->count() > 0)
		{
			$this->danger('characterInBlacklist');
		}
		else
		{
			$this->validate($request, [
				'title' => 'required|max:256',
				'content' => 'required|max:1024',
			]);

			$mail = new Mail;

			$mail->sender_id = $this->player->id;
			$mail->receiver_id = $player->id;
			$mail->title = $request->input('title');
			$mail->content = $request->input('content');
			$mail->date = time();

			if($mail->save())
			{
				$this->success('messageSent');
			}
			else
			{
				$this->danger('saveError');
			}

		}

		return redirect(route('message.create'));
	}


	public function getInbox()
	{
		$mails = $this->player->inbox()->orderBy('date', 'desc')->paginate(25);
		return view('message.inbox.list')
			->with('mails', $mails);
	}

	public function getOutbox()
	{
		$mails = $this->player->outbox()->orderBy('date', 'desc')->paginate(25);
		return view('message.outbox.list', $mails)
			->with('mails', $mails);
	}

	public function getBlacklist()
	{
		return view('message.blacklist')
			->with('blacklist', $this->player->blacklist);
	}


	public function inboxView(Mail $mail)
	{
		if(empty($mail) || $mail->receiver_deleted)
		{
			$this->danger('messageDoesNotExists');
		}
		elseif($mail->receiver_id != $this->player->id)
		{
			$this->danger('wrongMessage');
		}
		else
		{
			$mail->viewed = true;
			$mail->save();

			return view('message.inbox.view')
				->with('mail', $mail);
		}
		return redirect(route('message.inbox.index'));
	}

	public function reply(Mail $mail)
	{
		if($mail->receiver_id != $this->player->id)
		{
			$this->danger('wrongMessage');
		}
		else
		{
			return view('mail.create')
				->with('to', $mail->sender->name)
				->with('title', 'Re: ' . $mail->title);
		}

		return redirect(route('message.inbox.index'));
	}

	public function resend(Mail $mail)
	{
		if($mail->sender_id != $this->player->id)
		{
			$this->danger('wrongMessage');
		}
		else
		{
			return view('message.create')
				->with('title', $mail->title)
				->with('content', $mail->content);
		}
	}

	public function outboxView(Mail $mail)
	{
		if(empty($mail) || $mail->sender_deleted)
		{
			$this->danger('messageDoesNotExists');
		}
		elseif($mail->sender_id != $this->player->id)
		{
			$this->danger('wrongMessage');
		}
		else
		{
			return view('message.outbox.view')
				->with('mail', $mail);
		}
		return redirect(route('message.outbox.index'));
	}

	public function addBlacklist(Request $request)
	{
		$name = $request->input('name');

		$player = $this->world->characters()->whereName($name)->first();

		if(empty($player))
		{
			$this->danger('characterDoesNotExists');
		}
		elseif($player->id == $this->player->id)
		{
			$this->danger('youCanNotBlockYourself');
		}
		elseif($this->player->blacklist()->where('blocked_id', '=', $player->id)->count() > 0)
		{
			$this->danger('characterAlreadyInBlacklist');
		}
		else
		{
			$this->player->blacklist()->attach($player);

			$this->success('characterBlocked');
		}

		return redirect(route('blacklist.index'));
	}

	public function removeBlacklist(Player $player)
	{
		if($this->player->blacklist()->where('blocked_id', '=', $player->id)->count() == 0)
		{
			$this->danger('characterIsNotInBlacklist');
		}
		else
		{
			$this->player->blacklist()->detach($player);
		}

		return redirect(route('blacklist.index'));
	}
}
