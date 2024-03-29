@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		<h2>Praca {{ $work->getTitle() }} -- Podgląd</h2>
	</div>

	<div class="panel-body">


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}

	{!! BootForm::staticInput('<strong>Nazwa</strong>')
		->value($work->getName()) !!}

	{!! BootForm::staticInput('<strong>Nazwa wyświetlana</strong>')
		->value($work->getTitle()) !!}

	{!! BootForm::staticInput('<strong>Opis</strong>')
		->value($work->getDescription()) !!}

	{!! BootForm::staticInput('<strong>Czas trwania</strong>')
		->value(time_to_duration($work->duration)) !!}


	{!! BootForm::staticInput('<strong>Koszta</strong>')
		->value($work->getCosts()->rawRender()) !!}

	{!! BootForm::staticInput('<strong>Nagrody</strong>')
		->value($work->getRewards()->rawRender()) !!}

	{!! BootForm::staticInput('<strong>Wymagania</strong>')
		->value($work->getRequirements()->rawRender()) !!}



	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.workGroup.show', ['workGroup' => $work->group->id]) }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.workGroup.work.edit', ['workGroup' => $work->group->id, 'work' => $work->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.workGroup.work.destroy', ['workGroup' => $work->group->id, 'work' => $work->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection