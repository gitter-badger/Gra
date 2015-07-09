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

	{!! BootForm::staticInput('<strong>Opis</strong>')
		->value($quest->getDescription()) !!}

	{!! BootForm::staticInput('<strong>Nagrody</strong>')
		->value($quest->getRewards()->rawRender()) !!}

	{!! BootForm::staticInput('<strong>Wymagania</strong>')
		->value($quest->getRequirements()->rawRender()) !!}



	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.questGroup.show', ['questGroup' => $quest->group->id]) }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.questGroup.quest.edit', ['questGroup' => $quest->group->id, 'quest' => $quest->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.questGroup.quest.destroy', ['questGroup' => $quest->group->id, 'quest' => $quest->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection