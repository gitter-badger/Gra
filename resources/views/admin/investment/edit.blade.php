@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($investment))

			<h2>{{ $investment->name }} -- Edycja</h2>
		@else

			<h2>Nowa inwestycja</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($investment))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.investment.update', ['investment' => $investment->id])) !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.investment.store')) !!}
	@endif


	{!! BootForm::text('<strong>Nazwa</strong>', 'name')->required()
		->defaultValue(isset($investment) ? $investment->name : null) !!}


	{!! BootForm::number('<strong>Bazowy przychód</strong>', 'baseIncome')
		->min(0)->max(100000)->defaultValue(isset($investment) ? $investment->baseIncome : null) !!}

	{!! BootForm::number('<strong>Przychód na poziom</strong>', 'incomePerLevel')
		->min(0)->max(100000)->defaultValue(isset($investment) ? $investment->incomePerLevel : null) !!}

	{!! BootForm::number('<strong>Maksymalny poziom przychodu</strong>', 'maxIncome')
		->min(0)->max(100)->defaultValue(isset($investment) ? $investment->maxIncome : null) !!}


	{!! BootForm::number('<strong>Bazowa pojemność</strong>', 'baseCapacity')
		->min(0)->max(100000)->defaultValue(isset($investment) ? $investment->baseCapacity : null) !!}

	{!! BootForm::number('<strong>Pojemność na poziom</strong>', 'capacityPerLevel')
		->min(0)->max(100000)->defaultValue(isset($investment) ? $investment->capacityPerLevel : null) !!}

	{!! BootForm::number('<strong>Maksymalny poziom pojemności</strong>', 'maxCapacity')
		->min(0)->max(100)->defaultValue(isset($investment) ? $investment->maxCapacity : null) !!}


	{!! BootForm::number('<strong>Koszt rozbudowy</strong>', 'upgradeCost')
		->min(0)->max(100000)->defaultValue(isset($investment) ? $investment->upgradeCost : null) !!}

	{!! BootForm::duration('<strong>Przychód co</strong>', 'time')
		->defaultValue(isset($investment) ? $investment->time : null) !!}



	<div class="col-xs-offset-4">

		@if(isset($investment))

			<a class="btn btn-danger" href="{{ route('admin.investment.show', ['investment' => $investment->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
		@else

			<a class="btn btn-danger" href="{{ route('admin.investment.index') }}">{!! entity('icon')->icon('remove') !!}</a>
		@endif

		<button type="submit" class="btn btn-success">

			{!! entity('icon')->icon('ok') !!}
		</button>

	</div>

	{!! BootForm::close() !!}

	</div>
</div>

@endsection

