@extends('app')



@section('content')

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Grupy zadań</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nazwa surowa</th>
					<th>Ilość zadań</th>
					<th></th>
				</tr>
			</thead>
			<tbody>

			@foreach($questGroups as $questGroup)

			<tr>
				<td>{{ $questGroup->id }}</td>
				<td>{{ $questGroup->name }}</td>
				<td>{{ $questGroup->quests()->count() }}</td>
				<td>
					<a href="{{ route('admin.questGroup.show', ['questGroup' => $questGroup->id]) }}" class="btn btn-info">

						{!! entity('icon')->icon('eye-open') !!}
					</a>
					<a href="{{ route('admin.questGroup.edit', ['questGroup' => $questGroup->id]) }}" class="btn btn-primary">

						{!! entity('icon')->icon('pencil') !!}
					</a>

					{!! BootForm::open()->delete()->action(route('admin.questGroup.destroy', ['questGroup' => $questGroup->id]))->addClass('form-inline') !!}
					{!! BootForm::token() !!}

					{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

					{!! BootForm::close() !!}
				</td>

			</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.questGroup.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
		<a href="{{ route('admin.questGroup.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>

	</div>
</div>


@endsection