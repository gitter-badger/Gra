@extends('mail.base')


@section('mail-content')


{!! BootForm::openHorizontal(2, 10) !!}

{!! BootForm::staticInput(trans('mail.from'))
	->value($mail->receiver->name) !!}

{!! BootForm::staticInput(trans('mail.date'))
	->value($mail->date) !!}

{!! BootForm::staticInput(trans('mail.title'))
	->value($mail->title) !!}

{!! BootForm::staticInput(trans('mail.content'))
	->value($mail->content) !!}


{!! BootForm::close() !!}

<div class="row">
	<div class="col-md-10 col-md-offset-2">
		<div class="btn-group">
			
			<a href="{{ url('/messages/create/resend/' . $mail->id) }}" class="btn btn-primary">
				
				@lang('mail.resend')
			</a>

			<a href="{{ url('/messages/outbox/delete/' . $mail->id) }}" class="btn btn-danger">
				
				@lang('mail.delete')
			</a>

		</div>
	</div>
</div>

@endsection