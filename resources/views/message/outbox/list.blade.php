@extends('message.base')


@section('mail-content')

<table class="table">

	<thead>
		<tr>
			<th>@lang('mail.to')</th>
			<th>@lang('mail.title')</th>
			<th>@lang('mail.date')</th>
			<th></th>
		</tr>
	</thead>

	<tbody>
		
	@foreach($mails as $mail)


		@if($mail->viewed)
		<tr>
		@else
		<tr class="unread">
		@endif

			<td>{{ $mail->receiver->name }}</td>
			<td>{{ $mail->title }}</td>
			<td>{{ $mail->date }}</td>
			<td>
				<div class="btn-group">
					<a href="{{ url('messages/inbox/view/' . $mail->id) }}" class="btn btn-primary">@lang('mail.open')</a>
					<a href="{{ url('messages/inbox/delete/' . $mail->id) }}" class="btn btn-danger">@lang('mail.delete')</a>
				</div>
			</td>
		</tr>	


	@endforeach
	</tbody>
	
	<tfoot>
		<tr>
			<td colspan="5">

				{!! $mails->render() !!}
			</td>
		</tr>
	</tfoot>

</table>

@endsection