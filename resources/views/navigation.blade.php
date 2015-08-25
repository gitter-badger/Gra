@if(isset($player))

	<nav id="mainNav" class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">

			{!! BootForm::open()->post()->addClass('navbar-form navbar-left')->action(route('game'))
				->addClass(is_null($player->place) || $player->isBusy || !isCurrentRoute('game') ? 'invisible' : null) !!}

			{!! BootForm::token() !!}
			{!! BootForm::hidden('place')->value(null) !!}

			{!! BootForm::submit(entity('icon')->icon('arrow-left'))->title(trans('action.back')) !!}

			{!! BootForm::close() !!}


			<div class="collapse navbar-collapse">

				<ul class="nav navbar-nav">

					<li{!! isCurrentRoute('game') ? ' class="active"' : '' !!}>

						<a href="{{ route('game') }}">

							<span class="glyphicon glyphicon-home"></span>
							{{ is_null($player->place) ? $player->location->getTitle() : $player->place->getTitle() }}
						</a>
					</li>

					<li class="dropdown{{ isCurrentRoute('player.index') ? ' active' : '' }}">

						<a href="" class="dropdown-toggle" data-toggle="dropdown">
						
							<span class="glyphicon glyphicon-user"></span>
							{{ $player->name }}
							<span class="caret"></span>
						</a>

						<ul class="dropdown-menu">

							<li {!! isCurrentRoute('player.statistics') ? ' class="active"' : '' !!}><a href="{{ route('player.statistics') }}">@lang('player.statistics')</a></li>
							<li {!! isCurrentRoute('player.items') ? ' class="active"' : '' !!}><a href="{{ route('player.items') }}">@lang('player.items')</a></li>
							<li {!! isCurrentRoute('player.talents') ? ' class="active"' : '' !!}><a href="{{ route('player.talents') }}">@lang('player.talents')</a></li>
							<li {!! isCurrentRoute('player.quests') ? ' class="active"' : '' !!}><a href="{{ route('player.quests') }}">@lang('player.quests')</a></li>

							@if(is_null($player->gang))

							<li {!! isCurrentRoute('player.invitations') ? ' class="active"' : '' !!}><a href="{{ route('player.invitations') }}">@lang('player.invitations')</a></li>
							@endif
						</ul>
					</li>

					<li{!! isCurrentRoute('message.index') ? ' class="active"' : '' !!}>

						<a href="{{ route('message.index') }}">

							<span class="glyphicon glyphicon-envelope"></span>
							@lang('navigation.messages')
							<span class="badge" data-ng-bind="player.messages"></span>
						</a>
					</li>

					<li{!! isCurrentRoute('reports.index') ? ' class="active"' : '' !!}>

						<a href="{{ route('reports.index') }}">

							<span class="glyphicon glyphicon-exclamation-sign"></span>
							@lang('navigation.reports')
							<span class="badge" data-ng-bind="player.reports"></span>
						</a>
					</li>

					<li{!! isCurrentRoute('chat.index') ? ' class="active"' : '' !!}>

						<a href="{{ route('chat.index') }}">

							<span class="glyphicon glyphicon-comment"></span>
							@lang('navigation.chat')
						</a>
					</li>

					<li{!! isCurrentRoute('premiumShop') ? ' class="active"' : '' !!}>

						<a href="{{ route('premiumShop') }}">

							<span class="glyphicon glyphicon-usd"></span>
							@lang('navigation.premiumShop')
						</a>
					</li>

					<li{!! isCurrentRoute('ranking') ? ' class="active"' : '' !!}>

						<a href="{{ route('ranking') }}">

							<span class="glyphicon glyphicon-list-alt"></span>
							@lang('navigation.ranking')
						</a>
					</li>

					<li{!! isCurrentRoute('world.list') ? ' class="active"' : '' !!}>

						<a href="{{ route('world.list') }}">

							<span class="glyphicon glyphicon-globe"></span>
							{{ $player->world->getTitle() }}
						</a>
					</li>

					@if($player->user->admin)

					<li{!! isCurrentRoute('admin.index') ? ' class="active"' : '' !!}>

						<a href="{{ route('admin.index') }}">

							<span class="glyphicon glyphicon-dashboard"></span>
							@lang('navigation.adminDashboard')
						</a>
					</li>

					@endif
					
					<li{!! isCurrentRoute('user.index') ? ' class="active"' : '' !!}>

						<a href="{{ route('user.index') }}">

							<span class="glyphicon glyphicon-cog"></span>
							@lang('navigation.user')
						</a>
					</li>


					<li{!! isCurrentRoute('user.logout') ? ' class="active"' : '' !!}>

						<a href="{{ route('user.logout') }}">

							<span class="glyphicon glyphicon-lock"></span>
							@lang('navigation.logout')
						</a>
					</li>


				</ul>

				<p class="navbar-text navbar-right" style="padding-right: 1em;">

					<strong>{{ $player->name }}</strong>
					<span class="vseparator"></span>
					<span class="badge level" data-ng-bind="player.level" title="@lang('statistic.level')">{{ $player->level }}</span>
					<span class="badge plantator" data-ng-bind="player.plantatorLevel" title="@lang('statistic.plantatorLevel')">{{ $player->plantatorLevel }}</span>
					<span class="badge smuggler" data-ng-bind="player.smugglerLevel" title="@lang('statistic.smugglerLevel')">{{ $player->smugglerLevel }}</span>
					<span class="badge dealer" data-ng-bind="player.dealerLevel" title="@lang('statistic.dealerLevel')">{{ $player->dealerLevel }}</span>
					
					<span class="vseparator"></span>
					<span>$<span data-ng-bind="player.money" title="@lang('statistic.money')">{{ $player->money }}</span></span>
					<span class="vseparator"></span>
					<span><span data-ng-bind="player.premiumPoints" title="@lang('statistic.premiumPoints')">{{ $player->premiumPoints }}</span>pp</span>
					<span class="vseparator"></span>
					<span><span data-ng-bind="player.luck" title="@lang('statistic.luck')">{{ $player->luck }}</span>%</span>
					<span class="vseparator"></span>
					<span><span data-ng-bind="player.weight" title="@lang('statistic.weight')">{{ $player->weight }}</span> / <span data-ng-bind="player.capacity" title="@lang('statistic.capacity')">{{ $player->capacity }}</span></span>
				</p>
			</div>


		</div>
	</nav>



@endif


