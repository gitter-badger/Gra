{!! BootForm::open()->post()->action(route('user.login')) !!}
{!! BootForm::token() !!}

{!! BootForm::email(trans('user.email'), 'l_email') !!}
{!! BootForm::password(trans('user.password'), 'l_password') !!}

{!! BootForm::checkbox(trans('user.remember'), 'l_remember') !!}

{!! BootForm::submit(trans('user.login'), 'btn-primary')->addClass('center-block') !!}


{!! BootForm::close() !!}