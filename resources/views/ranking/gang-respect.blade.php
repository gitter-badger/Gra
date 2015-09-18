@extends('ranking.base')


@section('ranking-content')

<table class=" rankingNavF__table table table-hover">
	<thead class="rankingNavF__table__thead">
		<tr class="rankingNavF__table__tr">
			<th>@lang('ranking.place')</th>
			<th>@lang('gang.respect')</th>
			<th>@lang('gang.name')</th>
		</tr>
	</thead>
	<tbody>
		@foreach($gangs as $record)

		@if(!is_null($player->gang) && $record['id'] == $player->gang->id)
		<tr class="rankingNavF__table__tr info">
		@else
		</tr>
		@endif

			<td>{{ $record['index'] }}</td>
			<td>{{ $record['respect'] }}</td>
			<td>{{ $record['name'] }}</td>
		</tr>

		@endforeach
	</tbody>
	<tfoot>
		<tr>
			<td colspan="3">
				
				{!! $gangs->render() !!}
			</td>
		</tr>
	</tfoot>
</table>


@endsection