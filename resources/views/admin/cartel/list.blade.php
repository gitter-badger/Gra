@extends('app')



@section('content')


<table class="table table-hover">
	<thead>
		<tr>
			<th>Id</th>
			<th>Nazwa</th>
			<th></th>
		</tr>
	</thead>
	<tbody>

	@foreach($cartels as $cartel)

	<tr>
		<td>{{ $cartel->id }}</td>
		<td>{{ $cartel->name }}</td>
		<td>
			<a href="{{ route('admin.cartel.show', ['cartel' => $cartel->id]) }}" class="btn btn-info">

				{!! entity('icon')->icon('eye-open') !!}
			</a>
			<a href="{{ route('admin.cartel.edit', ['cartel' => $cartel->id]) }}" class="btn btn-primary">

				{!! entity('icon')->icon('pencil') !!}
			</a>

			@if($cartel->population > 0)

				<div class="btn btn-danger disabled" title="Nie można usuną świata na którym są gracze">
					
					{!! entity('icon')->icon('trash') !!}
				</div>

			@else

				{!! BootForm::open()->delete()->action(route('admin.cartel.destroy', ['cartel' => $cartel->id]))->addClass('form-inline') !!}
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
<a href="{{ route('admin.cartel.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
<a href="{{ route('admin.cartel.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>

@endsection