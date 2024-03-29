<?php


namespace HempEmpire\Http\Controllers\Payments;

use Illuminate\Http\Request;
use HempEmpire\Http\Controllers\Controller;
use HempEmpire\User;
use HempEmpire\Payment;
use DB;
use Config;
use Auth;


class TransferujController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth');
	}


	public function findProduct($price)
	{
	}


	public function postIndex(Request $request)
	{
		if($request->ip() == '195.149.229.109')
		{
			$user = Auth::user();


			$payment = new Payment;
			$payment->payment_id = $request->input('tr_id');
			$payment->user()->associate($user);
			$payment->service = 'transferuj';
			$payment->operator = null;
			$payment->amount = $request->intput('tr_amount');
			$payment->price = $request->input('tr_paid');
			$payment->currency = 'no-data';

			$sum = md5($request->input('id') . $request->input('tr_id') . $request->input('tr_amount') .  $request->input('tr_crc') . Config::get('payments.transferuj.vendor-code'));

			if($request->input('tr_status') === 'TRUE' && $request->input('tr_error') === 'none' && $request->input('md5sum') === $sum)
			{
				$payment->success = true;
				$user->premiumPoints += $request->input('tr_amount');

				DB::transaction(function() use($user, $payment)
				{
					$user->save();
					$payment->save();
				});
			}
			else
			{
				$payment->success = false;
				$payment->save();
			}
		}

		return response('TRUE');
	}


}