<?php

namespace HempEmpire\Http\Controllers;

use Illuminate\Http\Request;

use HempEmpire\Http\Requests;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\Player;


class ReportsController extends Controller
{
	private $player;

	public function __construct()
	{
		$this->player = Player::getActive();
	}


    public function index()
    {
        return view('reports.list')
        	->with('reports', $this->player->reports()->orderBy('date', 'desc')->orderBy('id', 'desc')->paginate(25));
    }

    public function show($id)
    {
    	$report = $this->player->reports()->whereId($id)->first();

    	if(is_null($report))
    	{
            $this->danger('wrongReport');
    		return redirect(route('reports.index'));
    	}
    	else
    	{
            if(!$report->readed)
            {
                $report->readed = true;
                $report->save();
            }

    		return view('reports.view')
    			->with('report', $report);
    	}
    }

    public function destroy($id)
    {
        if($this->player->reports()->whereId($id)->delete())
        {
            $this->success('reportDeleted');
        }
        else
        {
            $this->danger('wrongReport');
        }

        return redirect(route('reports.index'));
    }

    public function readAll()
    {
        $this->player->reports()->update(['readed' => true]);
        return redirect(route('reports.index'));
    }

    public function destroyAll()
    {
        $this->player->reports()->delete();
        return redirect(route('reports.index'));
    }
}
