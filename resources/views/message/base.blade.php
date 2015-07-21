@extends('app')



@section('content')

<ul class="nav nav-tabs">

	<li {!! isCurrentRoute('message.create') ? ' class="active"' : '' !!}><a href="{{ route('message.create') }}">@lang('mail.create')</a></li>
	<li {!! isCurrentRoute('message.inbox.index') ? ' class="active"' : '' !!}><a href="{{ route('message.inbox.index') }}">@lang('mail.inbox')</a></li>
	<li {!! isCurrentRoute('message.outbox.index') ? ' class="active"' : '' !!}><a href="{{ route('message.outbox.index') }}">@lang('mail.outbox')</a></li>
	<li {!! isCurrentRoute('blacklist.index') ? ' class="active"' : '' !!}><a href="{{ route('blacklist.index') }}">@lang('mail.blacklist')</a></li>
</ul>
<div class="tab-content">

	<div class="panel panel-default">
		<div class="panel-body">
				   
			{!! Message::renderAll() !!}

			
			@yield('mail-content')
		</div>
	</div>

</div>

@endsection