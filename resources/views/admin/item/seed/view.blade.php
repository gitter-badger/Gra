

{!! BootForm::staticInput('<strong>Czas wzrostu</strong>')->value(Formatter::time($item->getGrowth())) !!}
{!! BootForm::staticInput('<strong>Czas podlewania</strong>')->value(Formatter::time($item->getWatering())) !!}
{!! BootForm::staticInput('<strong>Gatunek</strong>')->value($item->getSpecies()) !!}
{!! BootForm::staticInput('<strong>Plon</strong>')->value($item->getMinHarvest() . ' - ' . $item->getMaxHarvest()) !!}
{!! BootForm::staticInput('<strong>Jakość</strong>')->value($item->getQuality()) !!}
