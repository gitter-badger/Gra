

{!! BootForm::staticInput('<strong>Szybkość</strong>')->value($item->getSpeed()) !!}
{!! BootForm::staticInput('<strong>Koszt</strong>')->value($item->getCost()) !!}
{!! BootForm::staticInput('<strong>Pojemność</strong>')->value($item->getCapacity()) !!}
{!! BootForm::staticInput('<strong>Przyśpiesza</strong>')->value(Formatter::boolean($item->isBoostable())) !!}
