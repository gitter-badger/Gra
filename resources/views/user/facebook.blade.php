@extends('user.base')


@section('tab-content')

	@if(is_null(Auth::user()->fb_id))

		{!! BootForm::open()->post() !!}
		{!! BootForm::token() !!}
		{!! BootForm::hidden('action')->value('connect') !!}

		{!! BootForm::submit(trans('action.connectFacebook'), 'btn-primary')->addClass('center-block') !!}

		{!! BootForm::close() !!}

	@else

		{!! BootForm::open()->post() !!}
		{!! BootForm::token() !!}
		{!! BootForm::hidden('action')->value('modify') !!}

		<?php $checkbox = BootForm::checkbox(trans('player.facebookAvatar'), 'avatar'); ?>

		@if($player->fbAvatar)

			<?php $checkbox->check(); ?>
		@endif

		{!! $checkbox !!}

		{!! BootForm::submit(trans('action.save'), 'btn-primary')->addClass('center-block') !!}

		{!! BootForm::close() !!}

	@endif


@endsection