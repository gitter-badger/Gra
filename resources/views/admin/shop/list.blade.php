@extends('app')



@section('content')

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Sklepy</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nazwa</th>
					<th>Dostawy</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
	
			@foreach($shops as $shop)

				<tr>
					<td>{{ $shop->id }}</td>
					<td>{{ $shop->name }}</td>
					<td>{{ $shop->deliveries()->count() }}</td>
					<td>
						<a href="{{ route('admin.shop.show', ['shop' => $shop->id]) }}" class="btn btn-info">

							{!! entity('icon')->icon('eye-open') !!}
						</a>
						<a href="{{ route('admin.shop.edit', ['shop' => $shop->id]) }}" class="btn btn-primary">

							{!! entity('icon')->icon('pencil') !!}
						</a>

						{!! BootForm::open()->delete()->action(route('admin.shop.destroy', ['shop' => $shop->id]))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

						{!! BootForm::close() !!}
					</td>
				</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.shop.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
		<a href="{{ route('admin.shop.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>
	</div>
</div>


@endsection