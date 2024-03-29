
<div data-tutorial="true" data-tutorial-name="gang">
	<h4><strong>@lang('gang.title')</strong></h4>
	<?php $url = Request::url(); ?>


	@if(is_null($gang))
	
		@include('component.gang.create')
	@else
	
	<ul class="nav nav-tabs">
		
		<li{!! $view === 'general' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}">
				@lang('gang.general')
			</a>
		</li>

		<li{!! $view === 'members' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=members">
				@lang('gang.members')
			</a>
		</li>

		@if($gang->battleIsComming())

			<li{!! $view === 'battle' ? ' class="active"' : ''!!}>
				<a href="{{ $url }}?view=battle">
					@lang('gang.' . $gang->action)
				</a>
			</li>
		@else

			@if($player->member->can(HempEmpire\GangMember::PERMISSION_ATTACK))

			<li{!! $view === 'attack' ? ' class="active"' : ''!!}>
				<a href="{{ $url }}?view=attack">
					@lang('gang.attack')
				</a>
			</li>
			@endif

		@endif


		@if($player->member->can(\HempEmpire\GangMember::PERMISSION_UPGRADE))

		<li{!! $view === 'upgrade' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=upgrade">
				@lang('gang.upgrade')
			</a>
		</li>
		@endif


		@if($player->member->can(\HempEmpire\GangMember::PERMISSION_LOG))

		<li{!! $view === 'log' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=log">
				@lang('gang.log')
			</a>
		</li>
		@endif


		@if($player->member->can(\HempEmpire\GangMember::PERMISSION_CHAT_READ))
		
		<li{!! $view === 'chat' ? ' class="active"' : ''!!}>
			<a href="{{ $url }}?view=chat">
				@lang('gang.chat')
			</a>
		</li>
		@endif
	</ul>



	<div class="tab-content">
		<div class="well">

			@if($view === 'general')

				@include('component.gang.general')
			@endif

			@if($view === 'members')

				@include('component.gang.members')
			@endif

			@if($view === 'attack')

				@include('component.gang.attack')
			@endif

			@if($view === 'upgrade')

				@include('component.gang.upgrade')
			@endif

			@if($view === 'log')

				@include('component.gang.log')
			@endif

			@if($view === 'battle')

				@include('component.gang.battle')
			@endif

			@if($view === 'chat')

				@include('component.gang.chat')
			@endif

		</div>
	</div>

	@endif
</div>