@extends('app')



@section('content')

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Światy</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nazwa</th>
					<th>Polulacja</th>
					<th>Otwarty</th>
					<th></th>
				</tr>
			</thead>
			<tbody>

			@foreach($worlds as $world)

			<tr>
				<td>{{ $world->id }}</td>
				<td>@lang('world.' . $world->id)</td>
				<td>{{ $world->population }}</td>
				<td>{{ $world->open ? 'Tak' : 'Nie' }}</td>
				<td>
					<a href="{{ route('admin.world.show', ['world' => $world->id]) }}" class="btn btn-info">

						{!! entity('icon')->icon('eye-open') !!}
					</a>
					<a href="{{ route('admin.world.edit', ['world' => $world->id]) }}" class="btn btn-primary">

						{!! entity('icon')->icon('pencil') !!}
					</a>

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
				</td>

			</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.world.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>

	</div>
</div>


@endsection