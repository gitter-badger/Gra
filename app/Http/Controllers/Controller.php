<?php

namespace HempEmpire\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use HempEmpire\DispatchesMessages;

abstract class Controller extends BaseController
{
    use DispatchesJobs, ValidatesRequests;
    use DispatchesMessages;
}
