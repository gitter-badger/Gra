<?php
use HempEmpire\Requirements;


class RequirementTest extends TestCase
{

	public function testAddString()
	{
		$requirements = new Requirements;


		$result = $requirements->add('level:80');



		$this->assertTrue($result);
	}

}