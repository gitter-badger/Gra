

{!! BootForm::number('<strong>Prędkość</strong>', 'vspeed')
	->min(0.1)->step(0.01)->defaultValue(isset($item) && $item->getType() == 'vehicle' ? $item->getSpeed() : null) !!}

{!! BootForm::number('<strong>Koszt</strong>', 'cost')
	->min(0.1)->step(0.01)->defaultValue(isset($item) && $item->getType() == 'vehicle' ? $item->getCost() : null) !!}

{!! BootForm::number('<strong>Pojemność</strong>', 'capacity')
	->defaultValue(isset($item) && $item->getType() == 'vehicle' ? $item->getCapacity() : null) !!}

{!! BootForm::checkbox('<strong>Przyśpiesza</strong>', 'boostable')
	->defaultCheckState(isset($item) && $item->getType() == 'vehicle' ? $item->isBoostable() : false) !!}
