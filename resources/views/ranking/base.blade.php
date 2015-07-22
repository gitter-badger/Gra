@extends('app')


@section('content')

<ul class="nav nav-tabs">

	<li {!! isCurrentUrl(url('/ranking/level')) ? ' class="active"' : '' !!}><a href="{{ url('/ranking/level') }}">@lang('ranking.level')</a></li>
	<li {!! isCurrentUrl(url('/ranking/plantator')) ? ' class="active"' : '' !!}><a href="{{ url('/ranking/plantator') }}">@lang('ranking.plantator')</a></li>
	<li {!! isCurrentUrl(url('/ranking/smuggler')) ? ' class="active"' : '' !!}><a href="{{ url('/ranking/smuggler') }}">@lang('ranking.smuggler')</a></li>
	<li {!! isCurrentUrl(url('/ranking/dealer')) ? ' class="active"' : '' !!}><a href="{{ url('/ranking/dealer') }}">@lang('ranking.dealer')</a></li>
</ul>
<div class="tab-content">

	<div class="panel panel-default">
		<div class="panel-body">
				   
			{!! Message::renderAll() !!}

			
			@yield('ranking-content')
		</div>
	</div>

</div>




@endsection