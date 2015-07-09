@extends('app')


@section('content')

<ul class="nav nav-tabs">

	<li {!! isCurrentRoute('player.statistics') ? ' class="active"' : '' !!}><a href="{{ route('player.statistics') }}">@lang('player.statistics')</a></li>
	<li {!! isCurrentRoute('player.items') ? ' class="active"' : '' !!}><a href="{{ route('player.items') }}">@lang('player.items')</a></li>

</ul>

<div class="tab-content">
	<div class="panel panel-default">
		<div class="panel-body">
		   
		   @yield('tab-content')
		</div>
	</div>
</div>



@endsection