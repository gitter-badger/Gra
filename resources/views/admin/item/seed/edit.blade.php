
{!! BootForm::duration('<strong>Czas wzrostu</strong>', 'growth')
	->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getGrowth() : null) !!}

{!! BootForm::duration('<strong>Czas podlewania</strong>', 'watering')
	->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getWatering() : null) !!}


{!! BootForm::multiInputGroup('<strong>Plony</strong>')
	->after(BootForm::builder()->number('harvestMin')->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getMinHarvest() : null)->min(0)->max(1000000))
	->after('<span class="input-group-addon">-</span>')
	->after(BootForm::builder()->number('harvestMax')->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getMaxHarvest() : null)->min(0)->max(1000000))
	!!}

{!! BootForm::number('<strong>Jakość</strong>', 'sequality')
	->min(0)->max(5)->defaultValue(isset($item) && $item->getType() == 'seed' ? $item->getQuality() : null) !!}
