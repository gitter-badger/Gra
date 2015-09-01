@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($quest))
			<h2>Praca {{ $quest->getTitle() }} -- Podgląd</h2>

		@else

			<h2>Nowa misja</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($quest))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.quest.update', ['quest' => $quest->id])) !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.quest.store')) !!}
	@endif

	{!! BootForm::text('<strong>Nazwa</strong>', 'name')
		->value(isset($quest) ? $quest->getName() : null) !!}

	
	<?php 

	$checkbox = BootForm::checkbox('<strong>Przynaj nagrodę odrazu po zakończeniu</strong>', 'auto');

	if(empty($quest) || $quest->auto)
		$checkbox->check();

	echo $checkbox;
	?>

	<?php 

	$checkbox = BootForm::checkbox('<strong>Przerywalny</strong>', 'breakable');

	if(empty($quest) || $quest->breakable)
		$checkbox->check();

	echo $checkbox;
	?>
	
	<?php 

	$checkbox = BootForm::checkbox('<strong>Powtarzalny</strong>', 'repeatable');

	if(empty($quest) || $quest->repeatable)
		$checkbox->check();

	echo $checkbox;
	?>
	
	<?php 

	$checkbox = BootForm::checkbox('<strong>Daily</strong>', 'daily');

	if(empty($quest) || $quest->daily)
		$checkbox->check();

	echo $checkbox;
	?>


	{!! BootForm::staticInput('<strong>Nagrody - przykład</strong>')
		->value(\HempEmpire\Rewards::getConfig()) !!}

	{!! BootForm::textarea('<strong>Nagrody</strong>', 'rewards')
		->value(isset($quest) ? Formatter::stringify($quest->rewards, false, false, PHP_EOL) : null) !!}


	{!! BootForm::staticInput('<strong>Wymagania - przykład</strong>')
		->value(\HempEmpire\Requirements::getConfig()) !!}


	{!! BootForm::textarea('<strong>Wymagania</strong>', 'requires')
		->value(isset($quest) ? Formatter::stringify($quest->requires, false, false, PHP_EOL) : null) !!}


	{!! BootForm::staticInput('<strong>Cele - przykład</strong>')
		->value(\HempEmpire\Objectives::getConfig()) !!}


	{!! BootForm::textarea('<strong>Cele</strong>', 'objectives')
		->value(isset($quest) ? Formatter::stringify($quest->objectives, false, false, PHP_EOL) : null) !!}

		<div class="col-xs-offset-4">

			@if(isset($quest))

				<a class="btn btn-danger" href="{{ route('admin.quest.show', ['quest' => $quest->id]) }}">
					{!! entity('icon')->icon('remove') !!}
				</a>
			@else

				<a class="btn btn-danger" href="{{ route('admin.quest.index') }}">{!! entity('icon')->icon('remove') !!}</a>
			@endif

			<button type="submit" class="btn btn-success">

				{!! entity('icon')->icon('ok') !!}
			</button>

		</div>


	{!! BootForm::close() !!}

	</div>
</div>

@endsection