@extends('app')


@section('content')

<div class=" [ settingsPanelF ] row">


	<div class="col-xs-12 col-sm-3" style="padding-left:0px;">

		<div class="panel">
			<div class="panel-body">
				<ul class="[ settingsPanelF__ul ] nav nav-pills nav-stacked">

					<li class=" [ settingsPanelF__top ] ">Ustawienia</li>

					<li class=" [ settingsPanelF__item ] " {!! isCurrentRoute('user.tutorial') ? ' class="active"' : '' !!}><a href="{{ route('user.tutorial') }}">@lang('user.tutorial')</a></li>

					<li class=" [ settingsPanelF__item ] " {!! isCurrentRoute('user.change') ? ' class="active"' : '' !!}><a href="{{ route('user.change') }}">@lang('user.change')</a></li>

					<li class=" [ settingsPanelF__item ] " {!! isCurrentRoute('user.language') ? ' class="active"' : '' !!}><a href="{{ route('user.language') }}">@lang('user.language')</a></li>

					<li class=" [ settingsPanelF__item ] " {!! isCurrentRoute('user.facebook') ? ' class="active"' : '' !!}><a href="{{ route('user.facebook') }}">@lang('user.facebook')</a></li>

				</ul>
			</div>
		</div>

	</div>
	<div class=" [ settingsPanelF__content ] col-xs-12 col-sm-9">
		<div class="panel panel-default">
			<div class="panel-body">

			   {!! Message::renderAll() !!}
			   @yield('tab-content')

			</div>
		</div>
	</div>
</div>



@endsection