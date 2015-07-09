@extends('app')



@section('content')

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Lokacje</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nazwa surowa</th>
					<th>Nazwa wywietlana</th>
					<th>Ilość miejsc</th>
					<th></th>
				</tr>
			</thead>
			<tbody>

			@foreach($locations as $location)

			<tr>
				<td>{{ $location->id }}</td>
				<td>{{ $location->getName() }}</td>
				<td>{{ $location->getTitle() }}</td>
				<td>{{ $location->places()->count() }}</td>
				<td>
					<a href="{{ route('admin.location.show', ['location' => $location->id]) }}" class="btn btn-info">

						{!! entity('icon')->icon('eye-open') !!}
					</a>
					<a href="{{ route('admin.location.edit', ['location' => $location->id]) }}" class="btn btn-primary">

						{!! entity('icon')->icon('pencil') !!}
					</a>

					{!! BootForm::open()->delete()->action(route('admin.location.destroy', ['location' => $location->id]))->addClass('form-inline') !!}
					{!! BootForm::token() !!}

					{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

					{!! BootForm::close() !!}
				</td>

			</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.location.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
		<a href="{{ route('admin.location.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>

	</div>
</div>


@endsection