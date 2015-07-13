<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;


use HempEmpire\User;
use Config;
use Mail;




class SendVerification extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

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
    public function handle()
    {
        $data = [

            'email' => $this->user->email,
            'ip' => $this->user->registration_ip,
            'date' => $this->user->created_at,
            'token' => $this->user->token,
        ];


        Mail::send('mail.verification', $data, function($message)
        {
            $message->to($this->user->email)->subject('Account verification');
        });
    }
}