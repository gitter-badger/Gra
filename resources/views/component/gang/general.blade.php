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

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}
					{!! BootForm::hidden('action')->value('leave') !!}

					{!! BootForm::submit(trans('action.leave'), 'btn-danger') !!}

					{!! BootForm::close() !!}
				</div>
			</div>
		</div>
	</div>

</div>