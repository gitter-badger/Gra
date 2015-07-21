@extends('message.base')


@section('mail-content')

{!! BootForm::openHorizontal(['xs' => [2, 10]])->post()->action(route('message.send')) !!}
{!! BootForm::token() !!}


{!! BootForm::text(trans('mail.to'), 'to')->required()->defaultValue(isset($to) ? $to : null) !!}
{!! BootForm::text(trans('mail.title'), 'title')->required()->defaultValue(isset($title) ? $title : null) !!}
{!! BootForm::textarea(trans('mail.content'), 'content')->required()->defaultValue(isset($content) ? $content : null) !!}
{!! BootForm::submit(trans('actions.send'), 'btn-primary') !!}


{!! BootForm::close() !!}

@endsection