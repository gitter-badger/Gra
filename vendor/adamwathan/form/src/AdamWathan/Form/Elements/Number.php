<?php namespace AdamWathan\Form\Elements;

class Number extends Input
{

    protected $attributes = array(
        'type' => 'number',
        'min' => 0,
        'max' => 100,
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


    protected function renderAddon($type)
    {
        $html = '<span class="input-group-btn number-' . $type . '">';
        $html .= '<button class="btn btn-default" type="button">';
        $html .= '<span class="glyphicon glyphicon-' . $type . '"></span>';
        $html .= '</button>';
        $html .= '</span>';

        return $html;
    }

    public function render()
    {
        try
        {
            $this->attributes['value'] = $this->getValue();

            $html = '<div class="input-group">';
            $html .= $this->renderAddon('minus');
            $html .= parent::render();
            $html .= $this->renderAddon('plus');
            $html .= '</div>';

            return $html;
        }
        catch(\Exception $e)
        {
            dd($e->getMessage(), $e);
        }
    }
}
