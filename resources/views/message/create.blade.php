@extends('message.base')


@section('mail-content')


{!! BootForm::openHorizontal(['xs' => [1, 11]])->post()->action(route('message.send'))->addClass('messagesCreateF') !!}
{!! BootForm::token() !!}


{!! BootForm::text(trans('mail.to'), 'to')->required()->defaultValue(isset($to) ? $to : null)->placeholder('Podaj adresata') !!}
{!! BootForm::text(trans('mail.title'), 'title')->required()->defaultValue(isset($title) ? $title : null)->placeholder('Podaj tytuł wiadomości') !!}
{!! BootForm::textarea(trans('mail.content'), 'content')->required()->defaultValue(isset($content) ? $content : null)->placeholder('Wpisz treść') !!}
{!! BootForm::submit(trans('mail.send'), 'btn-primary') !!}


{!! BootForm::close() !!}

@endsection