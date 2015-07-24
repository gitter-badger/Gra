
<div>
	<h4><strong>@lang('gang.title')</strong></h4>
	<div class="well">

		@if(is_null($gang))

			<div class="row">
				<div class="col-xs-6 col-xs-offset-3">
					<div class="panel panel-default">
						<div class="panel-body">
							
								
							{!! BootForm::open()->post() !!}
							{!! BootForm::token() !!}
							{!! BootForm::hidden('action')->value('create') !!}


							{!! BootForm::text(trans('gang.name'), 'name')->required()->min(4)->max(32) !!}
							{!! BootForm::submit(trans('action.create'), 'btn-primary')->addClass('center-block') !!}

							{!! BootForm::close() !!}
						</div>
					</div>
				</div>
			</div>
		@else

			<div class="row">
				<div class="col-xs-6 col-xs-offset-3">

					<div class="panel panel-default">
						<div class="panel-body">
							<div class="text-center">

								<h4><strong>{{ $gang->name }}</strong></h4>
								<p><strong>@lang('gang.members'): </strong> {{ $gang->members()->count() }}</p>
								<p><strong>@lang('gang.capacity'): </strong> {{ $gang->membersCount }} / {{ $gang->membersLimit }}</p>
								<p><strong>@lang('gang.level'): </strong> {{ $gang->level}} </p>
								<p><strong>@lang('gang.respect'): </strong> {{ $gang->respect}} </p>
								<p><strong>@lang('gang.money'): </strong> ${{ $gang->money}} </p>
							</div>
						</div>
					</div>
				</div>

			</div>
			<div class="row">

				<div class="col-xs-12">
					
					<div class="panel panel-default">
						<div class="panel-heading"><h5><strong>@lang('gang.members')</strong></h5></div>
						<div class="panel-body">



							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>@lang('player.name')</th>
											<th>@lang('gang.role')</th>
											<th>@lang('statistic.level')</th>
											<th></th>
										</tr>
									</thead>
									<tbody>

										@foreach($gang->members as $member)

										<tr>
											<td>{{ $member->player->name }}</td>
											<td>@lang('gang.roles.' . $member->role)</td>
											<td>{{ $member->player->level }}</td>
											<td>

												@if($player->member->canModify($member))
													
													@if($player->member->can(HempEmpire\GangMember::PERMISSION_KICK))

														{!! BootForm::open()->post()->addClass('form-inline') !!}
														{!! BootForm::token() !!}
														{!! BootForm::hidden('action')->value('kick') !!}
														{!! BootForm::hidden('member')->value($member->id) !!}
																		
														{!! BootForm::submit(trans('action.kick'), 'btn-danger') !!}

														{!! BootForm::close() !!}
													@endif

													@if($player->member->can(HempEmpire\GangMember::PERMISSION_PROMOTE) && $member->canBePromoted())

														{!! BootForm::open()->post()->addClass('form-inline') !!}
														{!! BootForm::token() !!}
														{!! BootForm::hidden('action')->value('promote') !!}
														{!! BootForm::hidden('member')->value($member->id) !!}
																		
														{!! BootForm::submit(trans('action.promote'), 'btn-info') !!}

														{!! BootForm::close() !!}
													@endif

													@if($player->member->can(HempEmpire\GangMember::PERMISSION_DEMOTE) && $member->canBeDemoted())

														{!! BootForm::open()->post()->addClass('form-inline') !!}
														{!! BootForm::token() !!}
														{!! BootForm::hidden('action')->value('demote') !!}
														{!! BootForm::hidden('member')->value($member->id) !!}
																		
														{!! BootForm::submit(trans('action.demote'), 'btn-info') !!}

														{!! BootForm::close() !!}
													@endif

												@endif


											</td>
										</tr>



										@endforeach

									</tbody>
								</table>
							</div>




						</div>
					</div>
				</div>
			</div>
				


			@if($player->member->can(HempEmpire\GangMember::PERMISSION_INVITE))

			<div class="row">
				<div class="col-xs-12">
					
					<div class="panel panel-default">
						<div class="panel-heading"><h5><strong>@lang('gang.invitations')</strong></h5></div>
						<div class="panel-body">
							

							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>@lang('player.name')</th>
											<th>@lang('gang.invitationDate')</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										@forelse($gang->invitations as $invitation)
				
											<tr>
												<td>{{ $invitation->player->name }}</td>
												<td>{{ $invitation->created_at }}</td>
												<td>

													{!! BootForm::open()->post()->addClass('form-inline') !!}
													{!! BootForm::token() !!}

													{!! BootForm::hidden('action')->value('cancel') !!}
													{!! BootForm::hidden('invitation')->value($invitation->id) !!}

													{!! BootForm::submit(trans('action.cancel'), 'btn-danger') !!}

													{!! BootForm::close() !!}
												</td>
											</tr>
										@empty

											<tr>
												<td colspan="3">
													
													<h5 class="text-center">@lang('gang.invitationsEmpty')</h5>
												</td>
											</tr>

										@endforelse
									</tbody>
								</table>

								@if($gang->membersCount < $gang->membersLimit)

									{!! BootForm::open()->post()->addClass('form-inline') !!}
									{!! BootForm::token() !!}

									{!! BootForm::hidden('action')->value('invite') !!}
									{!! BootForm::text(null, 'name')->required() !!}
									{!! BootForm::submit(trans('action.invite'), 'btn-success') !!}

									{!! BootForm::close() !!}
								@endif
							</div>
						</div>
					</div>
				</div>
			</div>

			@endif

			@if($player->member->can(HempEmpire\GangMember::PERMISSION_ATTACK))
				
			<div class="row">
				<div class="col-xs-12">

					<div class="panel panel-default">
						<div class="panel-heading"><h5><strong>@lang('gang.attack')</strong></h5></div>
						<div class="panel-body">
							
							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>@lang('gang.name')</th>
											<th>@lang('gang.level')</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
									
									@forelse($gangs as $gang)

										<tr>
											<td>{{ $gang->name }}</td>
											<td>{{ $gang->level }}</td>
											<td>
												
												{!! BootForm::open()->post() !!}
												{!! BootForm::token() !!}

												{!! BootForm::hidden('action')->value('attack') !!}
												{!! BootForm::hidden('gang')->value($gang->id) !!}

												{!! BootForm::submit(trans('action.attack'), 'btn-primary') !!}

												{!! BootForm::close() !!}
											</td>
										</tr>
									@empty

									<tr>
										<td colspan="3">
											<h5 class="text-center">@lang('gang.attackEmpty')</h5>
										</td>
									</tr>

									@endforelse


									</tbody>
								</table>
							</div>


						</div>
					</div>
				</div>
			</div>


			@endif



		@endif

	</div>
</div>