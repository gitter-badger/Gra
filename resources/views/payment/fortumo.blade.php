
<div class="col-xs-12 col-sm-6 col-md-4">
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4>@lang('payment.fortumo.title')</h4>
		</div>

		<div class="panel-body equalize">
			<a id="fmp-button" href="#" rel="{{ Config::get('payments.fortumo.service-id') }}/{{ Auth::user()->id }}">

				<img src="http://pay.fortumo.com/images/fmp/fortumopay_96x47.png" width="96" height="47" alt="Mobile Payments by Fortumo" border="0" />
			</a>
		</div>
	</div>
</div>