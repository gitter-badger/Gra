<?php namespace AdamWathan\Form\Elements;

class Duration extends Input
{

    protected $attributes = array(
        'type' => 'text',
        'pattern' => '([0-9]+d)?\s*([0-9]+h)?\s*([0-9]+m)?\s*([0-9]+s)?',
    );

    public function defaultValue($value)
    {
        if (! $this->hasValue()) {
            $this->setValue($value);
        }

        return $this;
    }

    protected function hasValue()
    {
        return isset($this->attributes['value']);
    }


    protected function setValue($value)
    {
        if(is_numeric($value))
            $value = time_to_duration($value);
        
        return parent::setValue($value);
    }
}
