@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		@if(isset($work))
			<h2>Praca {{ $work->getTitle() }} -- Podgląd</h2>

		@else

			<h2>Nowa praca</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($work))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.workGroup.work.update', ['workGroup' => $work->group->id, 'work' => $work->id])) !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.workGroup.work.store', ['workGroup' => $workGroup->id])) !!}
	@endif

	{!! BootForm::text('<strong>Nazwa</strong>', 'name')
		->value(isset($work) ? $work->getName() : null) !!}

	{!! BootForm::duration('<strong>Czas trwania</strong>', 'duration')
		->value(isset($work) ? $work->duration : null) !!}

	{!! BootForm::staticInput('<strong>Koszta - przykład</strong>')
		->value(\HempEmpire\Costs::getConfig()) !!}

	{!! BootForm::textarea('<strong>Koszta</strong>', 'costs')
		->value(isset($work) ? Formatter::stringify($work->costs, false, false, PHP_EOL) : null) !!}

	{!! BootForm::staticInput('<strong>Nagrody - przykład</strong>')
		->value(\HempEmpire\Rewards::getConfig()) !!}

	{!! BootForm::textarea('<strong>Nagrody</strong>', 'rewards')
		->value(isset($work) ? Formatter::stringify($work->rewards, false, false, PHP_EOL) : null) !!}


	{!! BootForm::staticInput('<strong>Wymagania - przykład</strong>')
		->value(\HempEmpire\Requirements::getConfig()) !!}


	{!! BootForm::textarea('<strong>Wymagania</strong>', 'requires')
		->value(isset($work) ? Formatter::stringify($work->requires, false, false, PHP_EOL) : null) !!}



		<div class="col-xs-offset-4">

			@if(isset($work))

				<a class="btn btn-danger" href="{{ route('admin.workGroup.work.show', ['workGroup' => $work->group->id, 'work' => $work->id]) }}">
					{!! entity('icon')->icon('remove') !!}
				</a>
			@else

				<a class="btn btn-danger" href="{{ route('admin.workGroup.show', ['workGroup' => $workGroup->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
			@endif

			<button type="submit" class="btn btn-success">

				{!! entity('icon')->icon('ok') !!}
			</button>

		</div>


	{!! BootForm::close() !!}

	</div>
</div>

@endsection