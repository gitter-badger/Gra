<div>
	<div class="well text-center">
		
		<p><strong>@lang('rent.cost'): </strong> {{ Formatter::money($cost) }}</p>
		<p><strong>@lang('rent.duration'): </strong> {{ Formatter::time($duration) }}</p>

		{!! BootForm::open()->post() !!}
		{!! BootForm::token() !!}

		{!! BootForm::hidden('action')->value('rent') !!}

		{!! BootForm::submit(trans('action.rent'), 'btn-primary')->addClass('text-center') !!}

		{!! BootForm::close() !!}


	</div>

</div>