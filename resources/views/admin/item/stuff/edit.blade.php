

{!! BootForm::number('<strong>Jakość</strong>', 'stquality')
	->min(0)->max(100)->defaultValue(isset($item) && $item->getType() == 'stuff' ? $item->getQuality() * 100 : null) !!}
