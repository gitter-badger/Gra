<?php

namespace HempEmpire\Contracts;
use HempEmpire\LocationPlace;


interface Component
{
	public function loaded(LocationPlace $place);
	public function view();
	public function handle($action, $request);
	public function before();
	public function after();
	public function index();
	public function available();
}