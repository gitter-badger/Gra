@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-heading">

		<h2 class="text-center">Przedmioty</h2>
	</div>

	<div class="panel-body">

		<ul class="list-group">
			<li class="list-group-item"><a href="{{ route('admin.item.armor.index') }}">Zbroje <span class="badge">{{ $armorsCount }}</span></a></li>
			<li class="list-group-item"><a href="{{ route('admin.item.weapon.index') }}">Bronie <span class="badge">{{ $weaponsCount }}</span></a></li>
			<li class="list-group-item"><a href="{{ route('admin.item.food.index') }}">Pożywienie <span class="badge">{{ $foodsCount }}</span></a></li>
			<li class="list-group-item"><a href="{{ route('admin.item.seed.index') }}">Nasiona <span class="badge">{{ $seedsCount }}</span></a></li>
			<li class="list-group-item"><a href="{{ route('admin.item.stuff.index') }}">Susz <span class="badge">{{ $stuffsCount }}</span></a></li>
			<li class="list-group-item"><a href="{{ route('admin.item.vehicle.index') }}">Pojazdy <span class="badge">{{ $vehiclesCount }}</span></a></li>
		</ul>

		<a href="{{ route('admin.index') }}" class="btn btn-default pull-left">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.item.export') }}" class="btn btn-default">{!! entity('icon')->icon('export') !!}</a>

	</div>
</div>


@endsection