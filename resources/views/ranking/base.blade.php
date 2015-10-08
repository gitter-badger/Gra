@extends('app')


@section('content')

<ul class="navPanelF nav nav-tabs">

	<li class="navPanelF__item" {!! isCurrentUrl(url('/ranking/level')) ? ' class="active"' : '' !!}><a  href="{{ url('/ranking/level') }}">@lang('ranking.level')</a></li>
	<li class="navPanelF__item" {!! isCurrentUrl(url('/ranking/plantator')) ? ' class="active"' : '' !!}><a  href="{{ url('/ranking/plantator') }}">@lang('ranking.plantator')</a></li>
	<li class="navPanelF__item" {!! isCurrentUrl(url('/ranking/smuggler')) ? ' class="active"' : '' !!}><a  href="{{ url('/ranking/smuggler') }}">@lang('ranking.smuggler')</a></li>
	<li class="navPanelF__item" {!! isCurrentUrl(url('/ranking/dealer')) ? ' class="active"' : '' !!}><a  href="{{ url('/ranking/dealer') }}">@lang('ranking.dealer')</a></li>
	<li class="navPanelF__item" {!! isCurrentUrl(url('/ranking/respect')) ? ' class="active"' : '' !!}><a  href="{{ url('/ranking/respect') }}">@lang('ranking.respect')</a></li>
	<li class="navPanelF__item" {!! isCurrentUrl(url('/ranking/gang-respect')) ? ' class="active"' : '' !!}><a  href="{{ url('/ranking/gang-respect') }}">@lang('ranking.gangRespect')</a></li>
	<li class="navPanelF__item" {!! isCurrentUrl(url('/ranking/gang-money')) ? ' class="active"' : '' !!}><a  href="{{ url('/ranking/gang-money') }}">@lang('ranking.gangMoney')</a></li>
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