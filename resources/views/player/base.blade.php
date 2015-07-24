@extends('app')


@section('content')

<ul class="nav nav-tabs">

	<li {!! isCurrentRoute('player.statistics') ? ' class="active"' : '' !!}><a href="{{ route('player.statistics') }}">@lang('player.statistics')</a></li>
	<li {!! isCurrentRoute('player.items') ? ' class="active"' : '' !!}><a href="{{ route('player.items') }}">@lang('player.items')</a></li>

	@if(is_null($player->gang))


	<li {!! isCurrentRoute('player.invitations') ? ' class="active"' : '' !!}><a href="{{ route('player.invitations') }}">@lang('player.invitations')</a></li>
	@endif
</ul>

<div class="tab-content">
	<div class="panel panel-default">
		<div class="panel-body">
		   
		   @yield('tab-content')
		</div>
	</div>
</div>



@endsection