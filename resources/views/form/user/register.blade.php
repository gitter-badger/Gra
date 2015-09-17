
{!! BootForm::open()->post()->action(route('user.register')) !!}
{!! BootForm::token() !!}

{!! BootForm::email(trans('user.email'), 'r_email')->required() !!}
{!! BootForm::password(trans('user.password'), 'r_password')->required() !!}
{!! BootForm::password(trans('user.passwordConfirmation'), 'r_password_confirmation')->required() !!}


<?php 

$select = BootForm::select(trans('user.language'), 'r_language')->addClass('language-select');


foreach(Config::get('app.languages') as $lang)
	$select->addOption($lang, trans('lang.' . $lang));

$select->defaultValue(App::getLocale());

echo $select;
?>

<div class="center-block">
{!! Recaptcha::render() !!}
</div>

{!! BootForm::checkbox(trans('user.rules'), 'r_rules')->required() !!}
{!! BootForm::checkbox(trans('user.news'), 'r_news')->checked() !!}



{!! BootForm::submit(trans('action.register'), 'btn-primary')->addClass('center-block') !!}
{!! BootForm::close() !!}