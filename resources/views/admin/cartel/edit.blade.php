@extends('app')


@section('content')


@if(isset($cartel))

	{!! BootForm::openHorizontal(['xs' => [2, 10]])->put()->action(route('admin.cartel.update', ['cartel' => $cartel->id])) !!}
@else

	{!! BootForm::openHorizontal(['xs' => [2, 10]])->post()->action(route('admin.cartel.store')) !!}
@endif


{!! BootForm::text('<strong>Nazwa</strong>', 'name')
	->value(isset($cartel) ? $cartel->name : null) !!}



<div class="col-xs-offset-2">
	
	@if(isset($cartel))
		
		<a class="btn btn-danger" href="{{ route('admin.cartel.show', ['cartel' => $cartel->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
	@else
		
		<a class="btn btn-danger" href="{{ route('admin.cartel.index') }}">{!! entity('icon')->icon('remove') !!}</a>
	@endif
	<button type="submit" class="btn btn-success">

		{!! entity('icon')->icon('ok') !!}
	</button>

</div>

{!! BootForm::close() !!}

@endsection