@extends('message.base')


@section('mail-content')

<table class="messagesTableF table">

	<thead class="messagesTableF__thead">
		<tr class="messagesTableF__thead__tr">
			<th class="messagesTableF__thead__th">@lang('player.name')</th>
			<th class="messagesTableF__thead__th"></th>
		</tr>
	</thead>

	<tbody class="messagesTableF__tbody">
		@foreach($blacklist as $entry)

		<tr class="messagesTableF__tbody__tr">
			<td class="messagesTableF__tbody__td">{{ $entry->name }}</td>
			<td class="messagesTableF__tbody__td">
				<a href="{{ url('/messages/blacklist/remove/' . $entry->id) }}" class="btn btn-danger">

					<span class="glyphicon glyphicon-remove"></span>
				</a>
			</td>
		</tr>

		@endforeach

		<tr class="messagesTableF__tbody__tr">
			<td class="messagesTableF__tbody__td" colspan="2"> 

				{!! BootForm::open()->post()->action(route('blacklist.add')) !!}
				{!! BootForm::token() !!}


				<div class="input-group">

					<input type="text" name="name" class="form-control" placeholder="Wpisz użytkownika"/>

					<div class="input-group-btn">

						<button type="submit" class="btn btn-success">

							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</div>
				</div>

				{!! BootForm::close() !!}
	
			</td>
		</tr>

	</tbody>

</table>

@endsection