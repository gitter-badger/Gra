<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserTest extends TestCase
{
	protected $email = 'test@gmail.com';
	protected $password = '123456';

	use DatabaseMigrations;

	
	public function testRegister()
	{
		$this->visit(route('home'))
			->type($this->email, 'r_email')
			->type($this->password, 'r_password')
			->type($this->password, 'r_password_confirmation')
			->select(true, 'r_rules')
			->press(trans('user.register'))
			->seeInDatabase('users', ['email' => $this->email]);
	}
	

	public function testLogin()
	{
		$user = factory('HempEmpire\User')->create([
			'email' => $this->email,
			'password' => bcrypt($this->password),
		]);


		$this->visit(route('home'))
			->type($this->email, 'l_email')
			->type($this->password, 'l_password')
			->press(trans('user.login'))
			->assertTrue(Auth::check());
	}
}