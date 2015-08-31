@extends('app')

@section('navigation')
@endsection

@section('topbar')
@endsection


@section('content')

<?php $user = Auth::user(); ?>
<div class="panel panel-default">
	<div class="panel-body">
		
		<div class="row">
			<div class="col-xs-6 col-xs-offset-3">

				<h3 class="text-center">@lang('user.banned.title')</h3>
				
				<div class="row">

					<div class="col-xs-12 col-sm-4 text-right"><strong>@lang('user.banned.reason')</strong></div>
					<div class="col-xs-12 col-sm-8 text-left">@lang('user.ban.' . $user->banReason)</div>
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-4 text-right"><strong>@lang('user.banned.duration')</strong></div>
					<div class="col-xs-12 col-sm-8 text-left">

						{!! entity('timer')
							->min($user->banStart)
							->max($user->banEnd)
							->now(time()) !!}
					</div> 
				</div>

			</div>
		</div>


	</div>
</div>

@endsection