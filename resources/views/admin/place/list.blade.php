@extends('app')



@section('content')

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Miejsca</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nazwa surowa</th>
					<th>Nazwa wyświetlana</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
	
			@foreach($places as $place)

				<tr{!! $place->dangerous ? ' class="danger"' : '' !!}>
					<td>{{ $place->id }}</td>
					<td>{{ $place->getName() }}</td>
					<td>{{ $place->getTitle() }}</td>
					<td>
						<a href="{{ route('admin.place.show', ['place' => $place->id]) }}" class="btn btn-info">

							{!! entity('icon')->icon('eye-open') !!}
						</a>
						<a href="{{ route('admin.place.edit', ['place' => $place->id]) }}" class="btn btn-primary">

							{!! entity('icon')->icon('pencil') !!}
						</a>

						{!! BootForm::open()->delete()->action(route('admin.place.destroy', ['place' => $place->id]))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

						{!! BootForm::close() !!}
					</td>
				</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.place.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
		<a href="{{ route('admin.place.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>
	</div>
</div>


@endsection