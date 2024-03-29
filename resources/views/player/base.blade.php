@extends('app')


@section('content')

<ul class="nav nav-tabs">

	<li {!! isCurrentRoute('player.statistics') ? ' class="active"' : '' !!}>

		<a href="{{ route('player.statistics') }}">

			@lang('player.statistics')
		</a>
	</li>

	<li {!! isCurrentRoute('player.items') ? ' class="active"' : '' !!}>

		<a href="{{ route('player.items') }}">

			@lang('player.items')
		</a>
	</li>

	<li {!! isCurrentRoute('player.talents') ? ' class="active"' : '' !!}>

		<a href="{{ route('player.talents') }}">

			@lang('player.talents')
		</a>
	</li>

	<li {!! isCurrentRoute('player.quests') ? ' class="active"' : '' !!}>

		<a href="{{ route('player.quests') }}">

			@lang('player.quests')
			<span class="badge">{{ $player->quests()->whereActive(true)->count() }}</span>
		</a>
	</li>

	@if(is_null($player->gang))


		<li {!! isCurrentRoute('player.invitations') ? ' class="active"' : '' !!}>

			<a href="{{ route('player.invitations') }}">

				@lang('player.invitations')
			</a>
		</li>
	@endif
	
	<li {!! isCurrentRoute('player.reference') ? ' class="active"' : '' !!}>

		<a href="{{ route('player.reference') }}">

			@lang('player.reference')
		</a>
	</li>
</ul>

<div class="tab-content">
	<div class="panel panel-default">
		<div class="panel-body">
		   
		   @yield('tab-content')
		</div>
	</div>
</div>



@endsection