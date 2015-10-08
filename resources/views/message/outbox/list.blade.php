@extends('message.base')


@section('mail-content')

<table class="messagesTableF table">

	<thead class="messagesTableF__thead">
		<tr class="messagesTableF__thead__tr">
			<th class="messagesTableF__thead__th">@lang('mail.to')</th>
			<th class="messagesTableF__thead__th">@lang('mail.title')</th>
			<th class="messagesTableF__thead__th">@lang('mail.date')</th>
			<th class="messagesTableF__thead__th"></th>
		</tr>
	</thead>

	<tbody class="messagesTableF__tbody">
		
	@forelse($mails as $mail)


		@if($mail->viewed)
		<tr class="messagesTableF__tbody__tr">
		@else
		<tr class="messagesTableF__tbody__tr unread">
		@endif

			<td class="messagesTableF__tbody__td">{{ $mail->receiver->name }}</td>
			<td class="messagesTableF__tbody__td" data-emoticons="true">{{ $mail->title }}</td>
			<td class="messagesTableF__tbody__td">{{ date('Y-m-d H:i:s', $mail->date) }}</td>
			<td class="messagesTableF__tbody__td">
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
	
	<tfoot class="messagesTableF__tfoot">
		<tr>
			<td colspan="5">

				{!! $mails->render() !!}
			</td>
		</tr>
	</tfoot>

</table>

@endsection