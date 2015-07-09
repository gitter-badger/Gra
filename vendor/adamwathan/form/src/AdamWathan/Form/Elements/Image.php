<?php namespace AdamWathan\Form\Elements;

class Image extends File
{
    protected $attributes = array(
        'type' => 'file',
        'accept' => 'image/*',
    );

    protected $default = '';


    public function render()
    {
    	$result = '<img class="image-preview img-responsive center-block" data-for="' . $this->getAttribute('id') . '" src="' . $this->default . '"></img>';
    	$result .= parent::render();

    	return $result;
    }

    protected function setDefaultValue($value)
    {
    	$this->default = $value;
    	return $this;
    }

    public function defaultValue($value)
    {
    	return $this->setDefaultValue($value);
    }
}
