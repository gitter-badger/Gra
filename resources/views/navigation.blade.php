@if(isset($player))

	<nav id="mainNav" class="navF navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">

			<ul class="col-md-12 nav navbar-nav">

				<li>
					{!! BootForm::open()->post()->addClass('navbar-form navbar-left')->action(route('game'))
						->addClass(is_null($player->place) || $player->isBusy || !isCurrentRoute('game') ? 'invisible' : null)
						->data('help', trans('help.nav.back')) !!}

					{!! BootForm::token() !!}
					{!! BootForm::hidden('place')->value(null) !!}

					{!! BootForm::submit(entity('icon')->icon('arrow-left'))->title(trans('action.back'))
						->addClass('tutorial-step')->data('tutorial-index', 1)->attribute('title', trans('tutorial.general.back.title'))
						->data('content', trans('tutorial.general.back.content')) !!}

					{!! BootForm::close() !!}
				</li>

				@if(!isset($logoutOnly) || $logoutOnly == false)

				@if($player->isBusy)
					
					<li{!! isCurrentRoute('game') ? ' class="navF__li"' : '' !!} data-help="@lang('help.nav.game')">

						<a href="{{ route('game') }}" title="@lang('job.' . $player->jobName)" class="nav-timer">

							<div class="nav-timer-bar"  data-min="{{ $player->jobStart }}"
								data-max="{{ $player->jobEnd }}"></div>

							<div class="nav-timer-label">

								<span class="navF__li__glyphicon glyphicon glyphicon-home"></span>
								<span class="hidden-xs hidden-sm">@lang('job.' . $player->jobName)</span>
							</div>
						</a>
					</li>
				@else
					<li{!! isCurrentRoute('game') ? ' class="navF__li navF__li--active"' : ' class=" navF__li"' !!} data-help="@lang('help.nav.game')">

						<a href="{{ route('game') }}" title="{{ is_null($player->place) ? $player->location->getTitle() : $player->place->getTitle() }}">

							<span class="navF__li__glyphicon glyphicon glyphicon-home"></span>
							<span class="hidden-xs hidden-sm">{{ is_null($player->place) ? $player->location->getTitle() : $player->place->getTitle() }}</span>
						</a>
					</li>
				@endif

				<li class="dropdown{{ isCurrentRoute('player.index') ? ' active' : ' navF__li' }}" data-help="@lang('help.nav.player')">

					<a href="" class="dropdown-toggle" data-toggle="dropdown" title="{{ $player->name }}">
					
						<span class="navF__li__glyphicon glyphicon glyphicon-user"></span>
						<span class="hidden-xs hidden-sm">{{ $player->name }}</span>
						<span class="caret"></span>
					</a>

					<ul class="dropdown-menu">

						<li {!! isCurrentRoute('player.statistics') ? ' class="active"' : 'navF__li' !!}>

							<a href="{{ route('player.statistics') }}">

								@lang('player.statistics')
							</a>
						</li>

						<li {!! isCurrentRoute('player.items') ? ' class="active"' : 'navF__li' !!}>

							<a href="{{ route('player.items') }}">

								@lang('player.items')
							</a>
						</li>

						<li {!! isCurrentRoute('player.talents') ? ' class="active"' : 'navF__li' !!}>

							<a href="{{ route('player.talents') }}">

								@lang('player.talents')
							</a>
						</li>

						<li {!! isCurrentRoute('player.quests') ? ' class="active"' : 'navF__li' !!}>

							<a href="{{ route('player.quests') }}">

								@lang('player.quests')
								<span class="navF__li__badge">{{ $player->quests()->whereActive(true)->count() }}</span>
							</a>
						</li>

						@if(is_null($player->gang))


							<li {!! isCurrentRoute('player.invitations') ? ' class="active"' : 'navF__li' !!}>

								<a href="{{ route('player.invitations') }}">

									@lang('player.invitations')
								</a>
							</li>
						@endif
						
						<li {!! isCurrentRoute('player.reference') ? ' class="active"' : 'navF__li' !!}>

							<a href="{{ route('player.reference') }}">

								@lang('player.reference')
							</a>
						</li>
					</ul>
				</li>

				<li{!! isCurrentRoute('message.index') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.messages')">

					<a href="{{ route('message.index') }}" title="@lang('navigation.messages')">

						<span class="navF__li__glyphicon glyphicon glyphicon-envelope"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.messages')</span>
						<span class="navF__li__badge navF__li__badge--standard" data-ng-bind="player.messagesCount"></span>
					</a>
				</li>

				<li{!! isCurrentRoute('reports.index') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.reports')">

					<a href="{{ route('reports.index') }}" title="@lang('navigation.reports')">

						<span class="navF__li__glyphicon glyphicon glyphicon-exclamation-sign"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.reports')</span>
						<span class="navF__li__badge navF__li__badge--standard" data-ng-bind="player.reportsCount"></span>
					</a>
				</li>

				<li{!! isCurrentRoute('chat.index') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.chat')">

					<a href="{{ route('chat.index') }}" title="@lang('navigation.chat')">

						<span class="navF__li__glyphicon glyphicon glyphicon-comment"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.chat')</span>
					</a>
				</li>

				<li{!! isCurrentRoute('premiumShop') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.premiumShop')">

					<a href="{{ route('premiumShop') }}" title="@lang('navigation.premiumShop')">

						<span class="navF__li__glyphicon glyphicon glyphicon-usd"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.premiumShop')</span>
					</a>
				</li>

				<li{!! isCurrentRoute('ranking') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.ranking')">

					<a href="{{ route('ranking') }}" title="@lang('navigation.ranking')">

						<span class="navF__li__glyphicon glyphicon glyphicon-list-alt"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.ranking')</span>
					</a>
				</li>

				<li{!! isCurrentRoute('world.listin') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.world')">

					<a href="{{ route('world.listin') }}" title="{{ $player->world->getTitle() }}">

						<span class="navF__li__glyphicon glyphicon glyphicon-globe"></span>
						<span class="hidden-xs hidden-sm">{{ $player->world->getTitle() }}</span>
					</a>
				</li>

				@if($player->user->admin)

				<li{!! isCurrentRoute('admin.index') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.admin')">

					<a href="{{ route('admin.index') }}" title="@lang('navigation.adminDashboard')">

						<span class="navF__li__glyphicon glyphicon glyphicon-dashboard"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.adminDashboard')</span>
					</a>
				</li>

				@endif
				
				<li{!! isCurrentRoute('user.index') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.user')">

					<a href="{{ route('user.index') }}" title="@lang('navigation.user')">

						<span class="navF__li__glyphicon glyphicon glyphicon-cog"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.user')</span>
					</a>
				</li>
				@endif

				<li{!! isCurrentRoute('user.logout') ? ' class="navF__li navF__li--active"' : ' class="navF__li"' !!} data-help="@lang('help.nav.logout')">

					<a href="{{ route('user.logout') }}" title="@lang('navigation.logout')">

						<span class="navF__li__glyphicon glyphicon glyphicon-lock"></span>
						<span class="hidden-xs hidden-sm">@lang('navigation.logout')</span>
					</a>
				</li>


			</ul>


			@if(!isset($logoutOnly) || $logoutOnly == false)
			<p class="navF__navbar col-md-12 navbar-text navbar-right" style="padding-right: 1em;">

				<span class="navF__navbar__name" data-help="@lang('help.player.name')">
					
					<strong>{{ $player->name }}</strong>
				</span>

				<span class="vseparator"></span>


				<span data-help="@lang('help.player.level')">
					
					<span class="navF__li__badge level navF__li__badge--level" data-ng-bind="player.level" title="@lang('statistic.level')">
						
						{{ $player->level }}
					</span>
				</span>

				<span data-help="@lang('help.player.plantatorLevel')">

					<span class="navF__li__badge plantator navF__li__badge--plantator" data-ng-bind="player.plantatorLevel"
						title="@lang('statistic.plantatorLevel')">
	
						{{ $player->plantatorLevel }}
					</span>
				</span>

				<span data-help="@lang('help.player.smugglerLevel')">
					
					<span class="navF__li__badge smuggler navF__li__badge--smuggler" data-ng-bind="player.smugglerLevel"
						title="@lang('statistic.smugglerLevel')">

						{{ $player->smugglerLevel }}
					</span>
				</span>


				<span data-help="@lang('help.player.dealerLevel')">

					<span class="navF__li__badge dealer navF__li__badge--dealer" data-ng-bind="player.dealerLevel"
						title="@lang('statistic.dealerLevel')">

						{{ $player->dealerLevel }}
					</span>
				</span>


				<span class="navF__description" data-help="@lang('help.player.money')">

					$<span data-ng-bind="player.money" title="@lang('statistic.money')">

						{{ $player->money }}
					</span>
				</span>


				<span class="navF__description" data-help="@lang('help.player.premiumPoints')">

					<span data-ng-bind="player.premiumPoints" title="@lang('statistic.premiumPoints')">

						{{ $player->premiumPoints }}
					</span>pp
				</span>


				<span class="navF__description" data-help="@lang('help.player.luck')">

					<span data-ng-bind="player.luck" title="@lang('statistic.luck')">

						{{ $player->luck }}
					</span>%
				</span>


				<span class="navF__description" data-help="@lang('help.player.weight')">
				
					<span data-ng-bind="player.weight" title="@lang('statistic.weight')">
						
						{{ $player->weight }}
					</span> / 
					<span data-ng-bind="player.capacity" title="@lang('statistic.capacity')">

						{{ $player->capacity }}
					</span>
				</span>
			</p>
			@endif

		</div>
	</nav>

@endif


