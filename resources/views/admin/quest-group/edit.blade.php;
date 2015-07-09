@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($questGroup))

			<h2>{{ $questGroup->name }} -- Edycja</h2>
		@else

			<h2>Nowa grupa zadań</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($questGroup))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.questGroup.update', ['questGroup' => $questGroup->id])) !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.questGroup.store')) !!}
	@endif



	{!! BootForm::text('<strong>Nazwa</strong>', 'name')->defaultValue(isset($questGroup) ? $questGroup->name : null)->required() !!}




	<div class="col-xs-offset-4">

		@if(isset($questGroup))

			<a class="btn btn-danger" href="{{ route('admin.questGroup.show', ['questGroup' => $questGroup->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
		@else

			<a class="btn btn-danger" href="{{ route('admin.questGroup.index') }}">{!! entity('icon')->icon('remove') !!}</a>
		@endif

		<button type="submit" class="btn btn-success">

			{!! entity('icon')->icon('ok') !!}
		</button>

	</div>

	{!! BootForm::close() !!}

	</div>
</div>

@endsection
