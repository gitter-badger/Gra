@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		<h2>Praca {{ $quest->getTitle() }} -- Podgląd</h2>
	</div>

	<div class="panel-body">


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}

	{!! BootForm::staticInput('<strong>Nazwa</strong>')
		->value($quest->getName()) !!}

	{!! BootForm::staticInput('<strong>Nazwa wyświetlana</strong>')
		->value($quest->getTitle()) !!}

	{!! BootForm::staticInput('<strong>Tekst przy rozpoczęciu</strong>')
		->value($quest->getDescription()) !!}

	{!! BootForm::staticInput('<strong>Tekst po zakończeniu</strong>')
		->value($quest->getCompleted()) !!}

	{!! BootForm::staticInput('<strong>Przynaj nagrodę odrazu po zakończeniu</strong>')
		->value($quest->auto ? 'Tak' : 'Nie') !!}

	{!! BootForm::staticInput('<strong>Daily</strong>')
		->value($quest->daily ? 'Tak' : 'Nie') !!}

	{!! BootForm::staticInput('<strong>Powtarzalny</strong>')
		->value($quest->repeatable ? 'Tak' : 'Nie') !!}

	{!! BootForm::staticInput('<strong>Przerywalny</strong>')
		->value($quest->breakable ? 'Tak' : 'Nie') !!}

	{!! BootForm::staticInput('<strong>Nagrody</strong>')
		->value($quest->getRewards()->rawRender()) !!}

	{!! BootForm::staticInput('<strong>Po rozpoczęciu</strong>')
		->value($quest->getAccept()->rawRender()) !!}

	{!! BootForm::staticInput('<strong>Wymagania</strong>')
		->value($quest->getRequirements()->rawRender()) !!}

	{!! BootForm::staticInput('<strong>Cele</strong>')
		->value($quest->getObjectives()->rawRender()) !!}


	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.quest.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.quest.edit', ['quest' => $quest->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.quest.destroy', ['quest' => $quest->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection