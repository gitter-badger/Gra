

{!! BootForm::number('<strong>Jakość</strong>', 'stquality')
	->min(0)->max(5)->defaultValue(isset($item) && $item->getType() == 'stuff' ? $item->getQuality() : null) !!}
