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
		
	@forelse($mails as $mail)


		@if($mail->viewed)
		<tr>
		@else
		<tr class="unread">
		@endif

			<td>{{ $mail->receiver->name }}</td>
			<td>{{ $mail->title }}</td>
			<td>{{ date('Y-m-d H:i:s', $mail->date) }}</td>
			<td>
				<div class="btn-group">
					<a href="{{ route('message.outbox.view', ['mail' => $mail->id]) }}" class="btn btn-primary">@lang('mail.open')</a>
					<a href="{{ route('message.outbox.delete', ['mail' => $mail->id]) }}" class="btn btn-danger">@lang('mail.delete')</a>
				</div>
			</td>
		</tr>	
	@empty
	
	<tr>
		<td colspan="4">
			<h4 class="text-center">@lang('mail.empty')</h4>
		</td>
	</tr>


	@endforelse
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