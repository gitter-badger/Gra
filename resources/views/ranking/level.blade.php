@extends('ranking.base')

@section('ranking-content')

<table class="rankingNavF__table table table-hover">
	<thead class="rankingNavF__table__thead">
		<tr class="rankingNavF__table__tr">
			<th>@lang('ranking.place')</th>
			<th>@lang('statistic.level')</th>
			<th>@lang('player.name')</th>
		</tr>
	</thead>
	<tbody>

		@foreach($players as $record)

		@if($record['id'] == $player->id)

		<tr class="rankingNavF__table__tr info">

		@else

		</tr>

		@endif

			<td>{{ $record['index'] }}</td>
			<td>{{ $record['level'] }}</td>
			<td>{{ $record['name'] }}</td>
		</tr>

		@endforeach

	</tbody>
	<tfoot>
		<tr class="rankingNavF__table__tr">
			<td colspan="3">
				
				{!! $players->render() !!}

			</td>
		</tr>
	</tfoot>
</table>


@endsection