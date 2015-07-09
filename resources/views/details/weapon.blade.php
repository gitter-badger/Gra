<div class='col-xs-6'>
	<p><strong>@lang('item.weapon.damage'): </strong><br/> {{ $item->getDamage()[0] }} - {{  $item->getDamage()[1] }}</p>
</div>
<div class='col-xs-6'>
	<p><strong>@lang('item.weapon.speed'): </strong><br/> {{ Formatter::signedPercent($item->getSpeed(), 2) }}</p>
</div>
<div class='col-xs-6'>
	<p><strong>@lang('item.weapon.critChance'): </strong><br/> {{ Formatter::percent($item->getCritChance(), 2) }}</p>
</div>
<div class='col-xs-6'>
	<p><strong>@lang('item.weapon.type'): </strong><br/> {{ trans('item.weapon.types.' . $item->getSubType()) }}</p>
</div>