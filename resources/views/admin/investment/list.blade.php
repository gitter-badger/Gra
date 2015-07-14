@extends('app')



@section('content')

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Inwestycje</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nazwa</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
	
			@foreach($investments as $investment)

				<tr>
					<td>{{ $investment->id }}</td>
					<td>{{ $investment->name }}</td>
					
					<td>
						<a href="{{ route('admin.investment.show', ['investment' => $investment->id]) }}" class="btn btn-info">

							{!! entity('icon')->icon('eye-open') !!}
						</a>
						<a href="{{ route('admin.investment.edit', ['investment' => $investment->id]) }}" class="btn btn-primary">

							{!! entity('icon')->icon('pencil') !!}
						</a>

						{!! BootForm::open()->delete()->action(route('admin.investment.destroy', ['investment' => $investment->id]))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

						{!! BootForm::close() !!}
					</td>
				</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.investment.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
		<a href="{{ route('admin.investment.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>
	</div>
</div>


@endsection