@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-heading">

		<h2>Przedmioty</h2>
	</div>

	<div class="panel-body">

	<table class="table table-hover">
		<thead>
			<tr>
				<th>Id</th>
				<th>Nazwa</th>
				<th>Cena</th>
				<th>Waga</th>
				<th>Obrażenia</th>
				<th>Szansa na kryt</th>
				<th>Szybkość</th>
				<th>Typ</th>
				<th></th>
			</tr>
		</thead>
		<tbody>

			@foreach($items as $item)

				<tr>
					<td>{{ $item->id }}</td>
					<td>{{ $item->getName() }}</td>
					<td>{{ $item->isPremium() ? $item->getPrice() . 'pp' : '$' . $item->getPrice() }}</td>
					<td>{{ $item->getWeight() }}</td>
					<td>{{ $item->getDamage()[0] }} - {{ $item->getDamage()[1] }}</td>
					<td>{{ Formatter::percent($item->getCritChance(), 2) }}</td>
					<td>{{ Formatter::signedPercent($item->getSpeed() * 100, 2) }}</td>
					<td>{{ $item->getSubType() }}</td>

					<td>

						<a href="{{ route('admin.item.' . $type . '.show', [$type => $item->id]) }}" class="btn btn-info">

							{!! entity('icon')->icon('eye-open') !!}
						</a>
						<a href="{{ route('admin.item.' . $type . '.edit', [$type => $item->id]) }}" class="btn btn-primary">

							{!! entity('icon')->icon('pencil') !!}
						</a>

						{!! BootForm::open()->delete()->action(route('admin.item.' . $type . '.destroy', [$type => $item->id]))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

						{!! BootForm::close() !!}
					</td>
				</tr>


			@endforeach

		</tbody>

	</table>

	<a href="{{ route('admin.item.index') }}" class="btn btn-default pull-left">{!! entity('icon')->icon('arrow-left') !!}</a>
	<div class="pagination-fix pull-left">{!! $items->render() !!}</div>
	<a href="{{ route('admin.item.' . $type . '.create') }}" class="btn btn-success pull-left">{!! entity('icon')->icon('plus') !!}</a>

	</div>
</div>

@endsection