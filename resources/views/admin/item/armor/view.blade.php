

{!! BootForm::staticInput('<strong>Pancerz</strong>')->value($item->getArmor()) !!}
{!! BootForm::staticInput('<strong>Szybkość</strong>')->value(Formatter::signedPercent($item->getSpeed(), 2)) !!}
