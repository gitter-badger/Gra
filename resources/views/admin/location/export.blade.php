@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-heading">

		<h2>Lokacje -- Eksport</h2>
	</div>

	<div class="panel-body">

		{!! BootForm::open() !!}


		{!! BootForm::textarea('<strong>Zawartość</strong>', 'content')->value($output) !!}


		{!! BootForm::close() !!}

		<a href="{{ route('admin.location.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>

	</div>
</div>


@endsection