@extends('app')


@section('content')




{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


{!! BootForm::staticInput('<strong>Nazwa</strong>')
	->value($cartel->name) !!}


{!! BootForm::close() !!}

<div class="col-xs-offset-4">

	<a href="{{ route('admin.cartel.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
	<a href="{{ route('admin.cartel.edit', ['cartel' => $cartel->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>



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
</div>

@endsection