{!! BootForm::open()->post()->action(route('user.register')) !!}
{!! BootForm::token() !!}

{!! BootForm::email(trans('user.email'), 'r_email')->required() !!}
{!! BootForm::password(trans('user.password'), 'r_password')->required() !!}
{!! BootForm::password(trans('user.passwordConfirmation'), 'r_password_confirmation')->required() !!}

{!! BootForm::checkbox(trans('user.rules'), 'r_rules')->required() !!}
{!! BootForm::checkbox(trans('user.news'), 'r_news')->checked() !!}

{!! BootForm::submit(trans('user.register'), 'btn-primary')->addClass('center-block') !!}
{!! BootForm::close() !!}