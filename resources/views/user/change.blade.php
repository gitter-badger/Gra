@extends('user.base')


@section('tab-content')

{!! BootForm::openHorizontal(['xs' => [12, 12], 'sm' => [4, 8]])->post() !!}
{!! BootForm::token() !!}


{!! BootForm::password(trans('user.currentPassword'), 'current_password')->required()->min(6) !!}
{!! BootForm::password(trans('user.newPassword'), 'new_password')->required()->min(6) !!}
{!! BootForm::password(trans('user.newPasswordConfirmation'), 'new_password_confirmation')->required()->min(6) !!}

{!! BootForm::submit(trans('user.change'), 'btn-primary') !!}
{!! BootForm::close() !!}


@endsection