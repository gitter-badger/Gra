@extends('app')



@section('content')

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Grupy prac</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nazwa surowa</th>
					<th>Nazwa wywietlana</th>
					<th>Ilość prac</th>
					<th></th>
				</tr>
			</thead>
			<tbody>

			@foreach($workGroups as $workGroup)

			<tr>
				<td>{{ $workGroup->id }}</td>
				<td>{{ $workGroup->getName() }}</td>
				<td>{{ $workGroup->getTitle() }}</td>
				<td>{{ $workGroup->works()->count() }}</td>
				<td>
					<a href="{{ route('admin.workGroup.show', ['workGroup' => $workGroup->id]) }}" class="btn btn-info">

						{!! entity('icon')->icon('eye-open') !!}
					</a>
					<a href="{{ route('admin.workGroup.edit', ['workGroup' => $workGroup->id]) }}" class="btn btn-primary">

						{!! entity('icon')->icon('pencil') !!}
					</a>

					{!! BootForm::open()->delete()->action(route('admin.workGroup.destroy', ['workGroup' => $workGroup->id]))->addClass('form-inline') !!}
					{!! BootForm::token() !!}

					{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

					{!! BootForm::close() !!}
				</td>

			</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.workGroup.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
		<a href="{{ route('admin.workGroup.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>

	</div>
</div>


@endsection