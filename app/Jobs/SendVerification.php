<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;


use HempEmpire\User;
use Config;
use Mail;
use Lang;
use App;




class SendVerification extends Job
{
    private $user;



    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }





    /**
     * Execute the job.
     *
     * @return void
     */
    protected function process()
    {
        $data = [

            'email' => $this->user->email,
            'ip' => $this->user->registration_ip,
            'date' => $this->user->created_at,
            'token' => $this->user->token,
        ];
        
        App::setLocale($this->user->language);

        echo 'Sending verification to ' . $this->user->name . PHP_EOL;


        Mail::send('emails.verification', $data, function($message)
        {
            $message->to($this->user->email)->subject('Account verification');
        });
    }
}
