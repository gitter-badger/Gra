@extends('app')


@section('content')


<div class="panel panel-default">

	<div class="panel-heading">

		<h2>@lang('world.' . $world->id) -- Podgląd</h2>
	</div>

	<div class="panel-body">


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}

	
	{!! BootForm::staticInput('<strong>Nazwa</strong>')
		->value(trans('world.' . $world->id)) !!}
	
	{!! BootForm::staticInput('<strong>Populacja</strong>')
		->value($world->population) !!}


	{!! BootForm::staticInput('<strong>Otwarty</strong>')
		->value($world->open ? 'Tak' : 'Nie') !!}



	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.world.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.world.edit', ['world' => $world->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>



			@if($world->population > 0)

				<div class="btn btn-danger disabled" title="Nie można usuną świata na którym są gracze">
					
					{!! entity('icon')->icon('trash') !!}
				</div>

			@else

				{!! BootForm::open()->delete()->action(route('admin.world.destroy', ['world' => $world->id]))->addClass('form-inline') !!}
				{!! BootForm::token() !!}

				{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

				{!! BootForm::close() !!}

			@endif
	</div>

	</div>
</div>

@endsection