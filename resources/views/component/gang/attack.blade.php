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
								<th>@lang('gang.members')</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
						
						@forelse($gangs as $gang)

							<tr>
								<td>{{ $gang->name }}</td>
								<td>{{ $gang->level }}</td>
								<td>{{ $gang->members()->count() }}</td>
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