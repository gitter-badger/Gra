<?php namespace AdamWathan\BootForms\Elements;

use AdamWathan\Form\Elements\Element;
use AdamWathan\Form\Elements\FormControl;


class MultiInputGroup extends Element
{
	protected $attributes = [

		'class' => 'input-group',
	];

	protected $elements = [];



	public function __construct(array $elements = [])
	{
		foreach($elements as $element)
			$this->after($element);
	}


	public function after($element)
	{
		if($element instanceof FormControl)
			$element->addClass('form-control');

		array_push($this->elements, $element);
	}

	public function before($element)
	{
		if($element instanceof FormControl)
			$element->addClass('form-control');
		
		array_unshift($this->elements, $element);
	}

	public function render()
	{
		$html = '<div';
		$html .= $this->renderAttributes();
		$html .= '>';
		$html .= implode('', $this->elements);
		$html .= '</div>';

		return $html;
	}
}