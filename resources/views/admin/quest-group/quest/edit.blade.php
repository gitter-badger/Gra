@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($quest))
			<h2>Praca {{ $quest->getTitle() }} -- Podgląd</h2>

		@else

			<h2>Nowa praca</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($quest))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.questGroup.quest.update', ['questGroup' => $quest->group->id, 'quest' => $quest->id])) !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.questGroup.quest.store', ['questGroup' => $questGroup->id])) !!}
	@endif

	{!! BootForm::text('<strong>Nazwa</strong>', 'name')
		->value(isset($quest) ? $quest->getName() : null) !!}




	{!! BootForm::staticInput('<strong>Nagrody - przykład</strong>')
		->value(\HempEmpire\Rewards::getConfig()) !!}

	{!! BootForm::textarea('<strong>Nagrody</strong>', 'rewards')
		->value(isset($quest) ? Formatter::stringify($quest->rewards, false, false, PHP_EOL) : null) !!}


	{!! BootForm::staticInput('<strong>Wymagania - przykład</strong>')
		->value(\HempEmpire\Requirements::getConfig()) !!}


	{!! BootForm::textarea('<strong>Wymagania</strong>', 'requires')
		->value(isset($quest) ? Formatter::stringify($quest->requires, false, false, PHP_EOL) : null) !!}



		<div class="col-xs-offset-4">

			@if(isset($quest))

				<a class="btn btn-danger" href="{{ route('admin.questGroup.quest.show', ['questGroup' => $quest->group->id, 'quest' => $quest->id]) }}">
					{!! entity('icon')->icon('remove') !!}
				</a>
			@else

				<a class="btn btn-danger" href="{{ route('admin.questGroup.show', ['questGroup' => $questGroup->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
			@endif

			<button type="submit" class="btn btn-success">

				{!! entity('icon')->icon('ok') !!}
			</button>

		</div>


	{!! BootForm::close() !!}

	</div>
</div>

@endsection