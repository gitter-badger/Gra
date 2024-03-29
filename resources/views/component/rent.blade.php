<div data-tutorial="true" data-tutorial-name="rent">
<h4><strong>@lang('rent.title')</strong></h4>
<div class="well text-center">
	
	<div class="row">
		<div class="col-xs-6 col-xs-offset-3">
			

			<div class="panel panel-default">
				<div class="panel-body">
					<p><strong>@lang('rent.cost'): </strong> {{ Formatter::money($cost) }}</p>
					<p><strong>@lang('rent.duration'): </strong> {{ Formatter::time($duration) }}</p>

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}

					{!! BootForm::hidden('action')->value('rent') !!}

					{!! BootForm::submit(trans('action.rent'), 'btn-primary')
						->addClass('text-center')
						->addClass('tutorial-step')
						->data('tutorial-index', 0)
						->attribute('title', trans('tutorial.rent.rent.title'))
						->data('content', trans('tutorial.rent.rent.content')) !!}

					{!! BootForm::close() !!}
				</div>
			</div>
			
		</div>
	</div>



</div>
</div>