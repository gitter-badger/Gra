

{!! BootForm::multiInputGroup('<strong>Obrażenia</strong>')
	->after(BootForm::builder()->number('damageMin')->defaultValue(isset($item) && $item->getType() == 'weapon' ? $item->getDamage()[0] : null))
	->after('<span class="input-group-addon">-</span>')
	->after(BootForm::builder()->number('damageMax')->defaultValue(isset($item) && $item->getType() == 'weapon' ? $item->getDamage()[1] : null))
	!!}

{!! BootForm::range('<strong>Szansa na cios krytyczny</strong>', 'critChance')
	->min(0)->max(100)->after('%')->defaultValue(isset($item) && $item->getType() == 'weapon' ? $item->getCritChance() * 100 : null) !!}

{!! BootForm::inputGroup('<strong>Szybkość</strong>', 'wspeed')
	->type('number')->min(-100)->max(100)->afterAddon('%')->defaultValue(isset($item) && $item->getType() == 'weapon' ? $item->getSpeed() * 100 : null) !!}

{!! BootForm::select('<strong>Rodzaj</strong>', 'subtype')
	->options(trans('item.weapon.types'))->defaultValue(isset($item) && $item->getType() == 'weapon' ? $item->getSubType() : null) !!}
