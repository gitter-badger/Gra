<?php

namespace HempEmpire\Http\Controllers;

use Illuminate\Http\Request;
use HempEmpire\Chat;





class ChatController extends Controller
{
    use Chat;










    public function getIndex()
    {
        return $this->view();
    }

    public function getMessage(Request $request)
    {
        return $this->receive($request->input('time'));
    }


    public function postMessage(Request $request)
    {
       return $this->send($request->input('message'));
    }

}
