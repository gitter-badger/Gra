
{!! BootForm::inputGroup('<strong>Zdrowie</strong>', 'health')
	->type('number')->min(0)->max(100)->defaultValue(isset($item) && $item->getType() == 'food' ? $item->getHealth() : null)
	->data('not-required', 'true')->beforeAddon('+') !!}

{!! BootForm::inputGroup('<strong>Energia</strong>', 'energy')
	->type('number')->min(0)->max(100)->defaultValue(isset($item) && $item->getType() == 'food' ? $item->getEnergy() : null)
	->data('not-required', 'true')->beforeAddon('+') !!}
