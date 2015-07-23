@extends('message.base')


@section('mail-content')

<table class="table">

	<thead>
		<tr>
			<th>@lang('player.name')</th>
			<th></th>
		</tr>
	</thead>

	<tbody>
		@foreach($blacklist as $entry)

		<tr>
			<td>{{ $entry->name }}</td>
			<td>
				<a href="{{ url('/messages/blacklist/remove/' . $entry->id) }}" class="btn btn-danger">

					<span class="glyphicon glyphicon-remove"></span>
				</a>
			</td>
		</tr>

		@endforeach

		<tr>
			<td colspan="2"> 

				{!! BootForm::open()->post()->action(route('blacklist.add')) !!}
				{!! BootForm::token() !!}


				<div class="input-group">

					<input type="text" name="name" class="form-control"/>

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