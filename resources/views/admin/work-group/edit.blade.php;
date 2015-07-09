@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($workGroup))

			<h2>{{ $workGroup->getTitle() }} -- Edycja</h2>
		@else

			<h2>Nowa grupa prac</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($workGroup))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.workGroup.update', ['workGroup' => $workGroup->id])) !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.workGroup.store')) !!}
	@endif



	{!! BootForm::text('<strong>Nazwa</strong>', 'name')->defaultValue(isset($workGroup) ? $workGroup->getName() : null)->required() !!}




	<div class="col-xs-offset-4">

		@if(isset($workGroup))

			<a class="btn btn-danger" href="{{ route('admin.workGroup.show', ['workGroup' => $workGroup->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
		@else

			<a class="btn btn-danger" href="{{ route('admin.workGroup.index') }}">{!! entity('icon')->icon('remove') !!}</a>
		@endif

		<button type="submit" class="btn btn-success">

			{!! entity('icon')->icon('ok') !!}
		</button>

	</div>

	{!! BootForm::close() !!}

	</div>
</div>

@endsection
