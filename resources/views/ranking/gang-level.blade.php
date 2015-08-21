@extends('ranking.base')


@section('ranking-content')

<table class="table table-hover">
	<thead>
		<tr>
			<th>@lang('ranking.place')</th>
			<th>@lang('gang.level')</th>
			<th>@lang('gang.name')</th>
		</tr>
	</thead>
	<tbody>
		@foreach($gangs as $record)

		@if(!is_null($player->gang) && $record['id'] == $player->gang->id)
		<tr class="info">
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
		<tr>
			<td colspan="3">
				
				{!! $gangs->render() !!}
			</td>
		</tr>
	</tfoot>
</table>


@endsection