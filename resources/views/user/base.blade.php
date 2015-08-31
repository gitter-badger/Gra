@extends('app')


@section('content')

<div class="row">


	<div class="col-xs-12 col-sm-3">

		<div class="panel panel-default">
			<div class="panel-body">
				<ul class="nav nav-pills nav-stacked">

					<li {!! isCurrentRoute('user.tutorial') ? ' class="active"' : '' !!}><a href="{{ route('user.tutorial') }}">@lang('user.tutorial')</a></li>
					<li {!! isCurrentRoute('user.change') ? ' class="active"' : '' !!}><a href="{{ route('user.change') }}">@lang('user.change')</a></li>
					<li {!! isCurrentRoute('user.language') ? ' class="active"' : '' !!}><a href="{{ route('user.language') }}">@lang('user.language')</a></li>
					<li {!! isCurrentRoute('user.facebook') ? ' class="active"' : '' !!}><a href="{{ route('user.facebook') }}">@lang('user.facebook')</a></li>

				</ul>
			</div>
		</div>

	</div>
	<div class="col-xs-12 col-sm-9">
		<div class="panel panel-default">
			<div class="panel-body">
			   
			   {!! Message::renderAll() !!}
			   @yield('tab-content')
			</div>
		</div>
	</div>
</div>



@endsection