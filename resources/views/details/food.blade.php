
@if(!is_null($item->getHealth()))
<div class='col-xs-6'>
	<p><strong>@lang('item.food.health'): </strong><br/> {{ Formatter::signed($item->getHealth()) }}</p>
</div>
@endif

@if(!is_null($item->getEnergy()))
<div class='col-xs-6'>
	<p><strong>@lang('item.food.energy'): </strong><br/> {{ Formatter::signed($item->getEnergy()) }}</p>
</div>
@endif