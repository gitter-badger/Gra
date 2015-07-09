
{!! BootForm::number('<strong>Pancerz</strong>', 'armor')->defaultValue(isset($item) && $item->getType() == 'armor' ? $item->getArmor() : null)->min(0) !!}
{!! BootForm::inputGroup('<strong>Szybkość</strong>', 'aspeed')->defaultValue(isset($item) && $item->getType() == 'armor' ? $item->getSpeed() * 100 : null)
	->type('number')->afterAddon('%')->min(-100)->max(100) !!}
