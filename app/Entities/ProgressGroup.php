<?php

namespace HempEmpire\Entities;


class ProgressGroup extends Entity
{
	protected $attributes = [

		'class' => 'progress-group',
	];


	protected function makeAddon($content)
	{
		return '<div class="progress-addon">' . $content . '</div>';
	}

	public function appendAddon($content)
	{
		return $this->append($this->makeAddon($content));
	}

	public function prependAddon($content)
	{
		return $this->prepend($this->makeAddon($content));
	}
}
