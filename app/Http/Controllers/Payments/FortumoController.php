<?php


namespace HempEmpire\Http\Controllers\Payments;

use Illuminate\Http\Request;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\User;
use HempEmpire\Payment;
use DB;
use Config;



class FortumoController extends Controller
{

	private function check_signature($params_array, $secret)
	{
		ksort($params_array);

		$str = '';
		foreach ($params_array as $k => $v)
		{
			if($k != 'sig')
			{
				$str .= "$k=$v";
			}
		}

		$str .= $secret;
		$signature = md5($str);

		return ($params_array['sig'] == $signature);
	}


	public function getIndex(Request $request)
	{
		$service = Config::get('payments.fortumo.service-id');
		$secret = Config::get('payments.fortumo.secret-id');
		$test = $request->input('test', false);


		if(!in_array($request->ip(), ['1.2.3.4', '3.4.5.6']))
		{
			return response('Unknown Ip', 403);
		}

		if($request->input('service_id') != $service)
		{
			return response('Invalid service', 404);
		}

		if(!check_signature($request->all(), $secret))
		{
			return response('Invalid signature', 404);
		}



		$user = User::findOrFail($request->input('cuid'));
		$points = $request->input('amount');



		$payment = new Payment;
		$payment->user()->associate($user);
		$payment->payment_id = $request->input('payment_id');
		$payment->service = 'fortumo';
		$payment->operator = $request->input('operator');
		$payment->price = $request->input('price');
		$payment->amount = $request->input('amount');
		$payment->currency = $request->input('currency'); 



		if(preg_match("/failed/i", $request->input('status'))) 
		{
			$payment->success = false;
			$payment->save();

			return response('Transaction failed', 404);
		}
		else
		{
			$payment->success = true;
			$user->premiumPoints += $points;

			DB::transaction(function() use($user, $payment)
			{
				$payment->save();
				$user->save();
			});
		}


		if($test)
		{
			return response('TEST OK');
		}
		else
		{
			return response('OK');
		}

	}
}