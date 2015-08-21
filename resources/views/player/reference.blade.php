@extends('player.base')


@section('tab-content')


<row>
	<div class="col-xs-12 col-sm-6">
		
		<input type="text" class="form-control" value="{{ route('player.doReference', ['token' => $player->token]) }}" readonly/>
	</div>
	<div class="col-xs-12 col-sm-6">
		
		<input type="text" class="form-control" value="{{ route('player.doReference', ['token' => $player->name]) }}" readonly/>
	</div>
</row>






@endsection