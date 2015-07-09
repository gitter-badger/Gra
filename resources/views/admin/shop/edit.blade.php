@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($shop))

			<h2>{{ $shop->name }} -- Edycja</h2>
		@else

			<h2>Nowy sklep</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($shop))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.shop.update', ['shop' => $shop->id])) !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.shop.store')) !!}
	@endif



	{!! BootForm::text('<strong>Nazwa</strong>', 'name')->defaultValue(isset($shop) ? $shop->name : null)->required() !!}




	<div class="col-xs-offset-4">

		@if(isset($shop))

			<a class="btn btn-danger" href="{{ route('admin.shop.show', ['shop' => $shop->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
		@else

			<a class="btn btn-danger" href="{{ route('admin.shop.index') }}">{!! entity('icon')->icon('remove') !!}</a>
		@endif

		<button type="submit" class="btn btn-success">

			{!! entity('icon')->icon('ok') !!}
		</button>

	</div>

	{!! BootForm::close() !!}

	</div>
</div>

@endsection
