@extends('player.base')


@section('tab-content')


<div class="row">
	<div class="col-xs-12 col-sm-6">
		
		<input type="text" class="form-control" value="{{ route('player.doReference', ['token' => $player->token]) }}" readonly/>
	</div>
	<div class="col-xs-12 col-sm-6">
		
		<input type="text" class="form-control" value="{{ route('player.doReference', ['token' => $player->name]) }}" readonly/>
	</div>
</div>

@if(!is_null($player->user->fb_id))

{!! BootForm::open()->post() !!}
{!! BootForm::token() !!}

{!! BootForm::submit(trans('action.postFacebook'), 'btn-primary')->addClass('center-block') !!}

{!! BootForm::close() !!}

@endif



@endsection