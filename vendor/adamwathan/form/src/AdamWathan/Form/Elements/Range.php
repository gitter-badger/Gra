<?php namespace AdamWathan\Form\Elements;

class Range extends Input
{

    protected $attributes = array(
        'type' => 'range',
    );

    protected $before;
    protected $after;

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

    protected function getValue()
    {
        if($this->hasValue())
        {
            return $this->attributes['value'];
        }
        else
        {

            $min = $this->hasAttribute('min') ? $this->getAttribute('min') : 0;
            $max = $this->hasAttribute('max') ? $this->getAttribute('max') : 100;

            return round(($max + $min) / 2);
        }
    }

    protected function hasAttribute($name)
    {
        return isset($this->attributes[$name]);
    }

    protected function setBefore($string)
    {
        $this->before = $string;
    }

    protected function setAfter($string)
    {
        $this->after = $string;
    }

    public function after($string)
    {
        $this->setAfter($string);
        return $this;
    }

    public function before($string)
    {
        $this->setBefore($string);
        return $this;
    }


    protected function renderAddonAttributes()
    {
        $html = '';

        if(isset($this->after))
            $html .= ' data-after="' . $this->after . '"'; 

        if(isset($this->before))
            $html .= ' data-before="' . $this->before . '"';

        return $html;
    }

    protected function renderAddon()
    {
        $html = '<span class="input-group-addon range-value"';
        $html .= $this->renderAddonAttributes();
        $html .= '>';

        if(isset($this->before))
            $html .= $this->before;

        $html .= $this->getValue();

        if(isset($this->after))
            $html .= $this->after;

        $html .= '</span>';

        return $html;
    }


    public function render()
    {
        $this->attributes['value'] = $this->getValue();

        $html = '<div class="input-group">';
        $html .= '<input';
        $html .= $this->renderAttributes();
        $html .= '/>';
        $html .= $this->renderAddon();
        $html .= '</div>';

        return $html;
    }
}
