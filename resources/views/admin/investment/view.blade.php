@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		<h2>{{ $investment->name }} -- Podgląd</h2>
	</div>

	<div class="panel-body">


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


	{!! BootForm::staticInput('<strong>Nazwa</strong>', 'name')
		->value($investment->name) !!}

	{!! BootForm::staticInput('<strong>Nazwa wyświetlana</strong>', 'name')
		->value(trans('investment.' . $investment->name)) !!}


	{!! BootForm::staticInput('<strong>Bazowy przychód</strong>', 'baseIncome')
		->value($investment->baseIncome) !!}

	{!! BootForm::staticInput('<strong>Przychód na poziom</strong>', 'incomePerLevel')
		->value($investment->incomePerLevel) !!}

	{!! BootForm::staticInput('<strong>Maksymalny poziom przychodu</strong>', 'maxIncome')
		->value($investment->maxIncome) !!}


	{!! BootForm::staticInput('<strong>Bazowa pojemność</strong>', 'baseCapacity')
		->value($investment->baseCapacity) !!}

	{!! BootForm::staticInput('<strong>Pojemność na poziom</strong>', 'capacityPerLevel')
		->value($investment->capacityPerLevel) !!}

	{!! BootForm::staticInput('<strong>Maksymalny poziom pojemności</strong>', 'maxCapacity')
		->value($investment->maxCapacity) !!}


	{!! BootForm::staticInput('<strong>Koszt rozbudowy</strong>', 'upgradeCost')
		->value($investment->upgradeCost) !!}

	{!! BootForm::staticInput('<strong>Przychód co</strong>', 'time')
		->value(time_to_duration($investment->time)) !!}






	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.investment.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.investment.edit', ['investment' => $investment->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.investment.destroy', ['investment' => $investment->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection