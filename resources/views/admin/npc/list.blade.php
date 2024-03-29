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
					<th>Zadania</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
	
			@foreach($npcs as $npc)

				<tr>
					<td>{{ $npc->id }}</td>
					<td>{{ $npc->name }}</td>
					<td>{{ count($npc->quests) }}</td>
					<td>
						<a href="{{ route('admin.npc.show', ['npc' => $npc->id]) }}" class="btn btn-info">

							{!! entity('icon')->icon('eye-open') !!}
						</a>
						<a href="{{ route('admin.npc.edit', ['npc' => $npc->id]) }}" class="btn btn-primary">

							{!! entity('icon')->icon('pencil') !!}
						</a>

						{!! BootForm::open()->delete()->action(route('admin.npc.destroy', ['npc' => $npc->id]))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

						{!! BootForm::close() !!}
					</td>
				</tr>

			@endforeach


			</tbody>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.npc.create') }}" class="btn btn-success">{!! entity('icon')->icon('plus') !!}</a>
		<a href="{{ route('admin.npc.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>
	</div>
</div>


@endsection