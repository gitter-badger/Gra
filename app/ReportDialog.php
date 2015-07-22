<?php


namespace HempEmpire;



class ReportDialog extends Dialog
{
	protected $type;
	protected $args;


	public function __construct($type = null, $args = [])
	{
		$this->type = $type;
		$this->args = $args;
	}



	public function with($name, $value)
	{
		$this->args[$name] = $value;
		return $this;
	}


	protected function getTitle()
	{
		return trans('report.' . $this->type . '.title', $this->args);
	}

	protected function getContent()
	{
		return trans('report.' . $this->type . '.content', $this->args);
	}
}