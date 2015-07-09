<?php namespace AdamWathan\Form\Elements;

class StaticInput extends FormControl
{
	protected $value;

    public function __construct()
    {
        
    }

    public function render()
    {
        $result  = '<div';

        $result .= $this->renderAttributes();

        $result .= '>';

        $result .= $this->value;

        $result .= '</div>';

        return $result;
    }

    public function value($value)
    {
        $this->setValue($value);
        return $this;
    }

    protected function setValue($value)
    {
    	$this->value = $value;
        return $this;
    }
}
