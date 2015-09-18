@extends('app')


@section('content')

<ul class="rankingNavF nav nav-tabs">

	<li {!! isCurrentUrl(url('/ranking/level')) ? ' class="active"' : '' !!}><a class="rankingNavF__link" href="{{ url('/ranking/level') }}">@lang('ranking.level')</a></li>
	<li {!! isCurrentUrl(url('/ranking/plantator')) ? ' class="active"' : '' !!}><a class="rankingNavF__link" href="{{ url('/ranking/plantator') }}">@lang('ranking.plantator')</a></li>
	<li {!! isCurrentUrl(url('/ranking/smuggler')) ? ' class="active"' : '' !!}><a class="rankingNavF__link" href="{{ url('/ranking/smuggler') }}">@lang('ranking.smuggler')</a></li>
	<li {!! isCurrentUrl(url('/ranking/dealer')) ? ' class="active"' : '' !!}><a class="rankingNavF__link" href="{{ url('/ranking/dealer') }}">@lang('ranking.dealer')</a></li>
	<li {!! isCurrentUrl(url('/ranking/respect')) ? ' class="active"' : '' !!}><a class="rankingNavF__link" href="{{ url('/ranking/respect') }}">@lang('ranking.respect')</a></li>
	<li {!! isCurrentUrl(url('/ranking/gang-respect')) ? ' class="active"' : '' !!}><a class="rankingNavF__link" href="{{ url('/ranking/gang-respect') }}">@lang('ranking.gangRespect')</a></li>
	<li {!! isCurrentUrl(url('/ranking/gang-money')) ? ' class="active"' : '' !!}><a class="rankingNavF__link" href="{{ url('/ranking/gang-money') }}">@lang('ranking.gangMoney')</a></li>
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