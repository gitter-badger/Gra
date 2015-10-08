{!! BootForm::open()->post()->action(route('user.login'))->addClass('loginPanelF') !!}
{!! BootForm::token() !!}

{!! BootForm::email(trans('user.email'), 'l_email') !!}
{!! BootForm::password(trans('user.password'), 'l_password') !!}

<?php $select = BootForm::select(trans('user.world'), 'world');

foreach(\HempEmpire\World::all() as $world)
{
	if($world->isAvailable())
		$select->addOption($world->getName(), $world->getTitle());

	if($world->isSelected())
		$select->defaultValue($world->getName());
}

echo $select; 
?>

{!! BootForm::checkbox(trans('user.remember'), 'l_remember') !!}

<div class="btn-group">
	{!! BootForm::submit(trans('action.login'), 'btn-primary') !!}
	<a href="{{ url('auth/facebook') }}" class="btn btn-default">@lang('action.loginFacebook')</a>
</div>
<a href="{{ url('auth/password/email') }}">@lang('action.forgetPassword')</a>


{!! BootForm::close() !!}