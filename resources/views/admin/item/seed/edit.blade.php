
{!! BootForm::duration('<strong>Czas wzrostu</strong>', 'growth')
	->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getGrowth() : null) !!}

{!! BootForm::duration('<strong>Czas podlewania</strong>', 'watering')
	->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getWatering() : null) !!}


{!! BootForm::multiInputGroup('<strong>Plony</strong>')
	->after(BootForm::builder()->number('harvestMin')->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getMinHarvest() : null))
	->after('<span class="input-group-addon">-</span>')
	->after(BootForm::builder()->number('harvestMax')->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getMaxHarvest() : null))
	!!}

{!! BootForm::multiInputGroup('<strong>Jakość</strong>')
	->after(BootForm::builder()->number('sequalityMin')->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getMinQuality() * 100 : null)->min(0)->max(100))
	->after('<span class="input-group-addon">-</span>')
	->after(BootForm::builder()->number('sequalityMax')->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getMaxQuality() * 100 : null)->min(0)->max(100))
	!!}
