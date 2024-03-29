@extends('ranking.base')

@section('ranking-content')

<table class="rankingNavF__table table table-hover">
	<thead class="rankingNavF__table__thead">
		<tr class="rankingNavF__table__tr">
			<th class="rankingNavF__table__th">@lang('ranking.place')</th>
			<th class="rankingNavF__table__th">@lang('statistic.level')</th>
			<th class="rankingNavF__table__th">@lang('player.name')</th>
		</tr>
	</thead>
	<tbody>

		@foreach($players as $record)

		@if($record['id'] == $player->id)

		<tr class="rankingNavF__table__tr info">

		@else

		</tr>

		@endif

			<td class="rankingNavF__table__td">{{ $record['index'] }}</td>
			<td class="rankingNavF__table__td">{{ $record['level'] }}</td>
			<td class="rankingNavF__table__td">{{ $record['name'] }}</td>
		</tr>

		@endforeach

	</tbody>
	<tfoot  class="rankingNavF__table__tfoot">
		<tr class="rankingNavF__table__tr">
			<td class="rankingNavF__table__td" colspan="3">
				
				{!! $players->render() !!}

			</td>
		</tr>
	</tfoot>
</table>


@endsection