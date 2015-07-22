@extends('ranking.base')


@section('ranking-content')

<table class="table table-hover">
	<thead>
		<tr>
			<th>@lang('ranking.place')</th>
			<th>@lang('statistic.smugglerLevel')</th>
			<th>@lang('player.name')</th>
		</tr>
	</thead>
	<tbody>
		@foreach($players as $record)

		@if($record['id'] == $player->id)
		<tr class="info">
		@else
		</tr>
		@endif

			<td>{{ $record['index'] }}</td>
			<td>{{ $record['smugglerLevel'] }}</td>
			<td>{{ $record['name'] }}</td>
		</tr>

		@endforeach
	</tbody>
	<tfoot>
		<tr>
			<td colspan="3">
				
				{!! $players->render() !!}
			</td>
		</tr>
	</tfoot>
</table>


@endsection