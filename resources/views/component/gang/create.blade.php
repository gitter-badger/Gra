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