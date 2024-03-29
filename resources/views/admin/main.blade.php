@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-heading">

		<h2 class="text-center">Panel administratora</h2>
	</div>

	<div class="panel-body">

		<ul class="list-group">
			<li class="list-group-item"><a href="{{ route('admin.world.index') }}">Światy</a></li>
			<li class="list-group-item"><a href="{{ route('admin.user.index') }}">Użytkownicy</a></li>
			<li class="list-group-item"><a href="{{ route('admin.location.index') }}">Lokacje</a></li>
			<li class="list-group-item"><a href="{{ route('admin.place.index') }}">Miejsca</a></li>
			<li class="list-group-item"><a href="{{ route('admin.item.index') }}">Przedmioty</a></li>
			<li class="list-group-item"><a href="{{ route('admin.shop.index') }}">Sklepy</a></li>
			<li class="list-group-item"><a href="{{ route('admin.workGroup.index') }}">Grupy prac</a></li>
			<li class="list-group-item"><a href="{{ route('admin.quest.index') }}">Zadania</a></li>
			<li class="list-group-item"><a href="{{ route('admin.investment.index') }}">Inwestycje</a></li>
			<li class="list-group-item"><a href="{{ route('admin.npc.index') }}">Npc</a></li>
			<li class="list-group-item"><a href="{{ route('admin.cartel.index') }}">Kartele</a></li>
		</ul>


	</div>
</div>


@endsection