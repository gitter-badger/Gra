@extends('message.base')


@section('mail-content')

{!! BootForm::openHorizontal(['xs' => [2, 10]]) !!}

{!! BootForm::staticInput(trans('mail.from'))
	->value($mail->sender->name) !!}

{!! BootForm::staticInput(trans('mail.date'))
	->value(date('Y-m-d H:i:s', $mail->date)) !!}

{!! BootForm::staticInput(trans('mail.title'))
	->value($mail->title)->data('emoticons', 'true') !!}

{!! BootForm::staticInput(trans('mail.content'))
	->value($mail->content)->data('emoticons', 'true') !!}


{!! BootForm::close() !!}

<div class="row">
	<div class="col-md-10 col-md-offset-2">
		<div class="btn-group">
			
			<a href="{{ route('message.reply', ['mail' => $mail->id]) }}" class="btn btn-primary">
				
				@lang('mail.reply')
			</a>

			<a href="{{ route('message.inbox.delete', ['mail' => $mail->id]) }}" class="btn btn-danger">
				
				@lang('mail.delete')
			</a>

		</div>
	</div>
</div>


@endsection