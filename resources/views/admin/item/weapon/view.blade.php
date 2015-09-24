
{!! BootForm::staticInput('<strong>Obrażenia</strong>')->value($item->getDamage()[0] . ' - ' . $item->getDamage()[1]) !!}
{!! BootForm::staticInput('<strong>Szybkość</strong>')->value(Formatter::signedPercent($item->getSpeed() * 100, 2)) !!}
{!! BootForm::staticInput('<strong>Szansa na cios krytyczny</strong>')->value(Formatter::percent($item->getCritChance(), 2)) !!}
{!! BootForm::staticInput('<strong>Rodzaj</strong>')->value(trans('item.weapon.types.' . $item->getSubType())) !!}

