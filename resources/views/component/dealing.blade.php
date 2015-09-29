<div data-tutorial="true" data-tutorial-name="dealing">

	<h4><strong>@lang('dealing.title')</strong></h4>

	
	<div class="row">

		<div class="col-xs-6 col-xs-offset-3">

			{!! BootForm::open()->post() !!}
			{!! BootForm::hidden('action')->value('deal') !!}

			<div class="row text-center">


				@foreach($stuffs as $stuff)
				<div class="col-xs-4">

					<img class="img-responsive" src="{{ $stuff->getImage() }}"/>


					{!! BootForm::checkbox($stuff->getTitle(), 'stuff[' . $stuff->getId() . '][sell]')
						->addClass('dealing-stuff')->data('id', $stuff->getId()) !!}

					<div id="dealing-stuff-{{ $stuff->getId() }}" class="dealing-stuff-data">
						<p><strong>@lang('item.stuff.quality'): </strong><br/>


							@for($i = 0; $i < 5; ++$i)

								@if($i < $stuff->getQuality())

									{!! entity('icon')->icon('star') !!}
								@else

									{!! entity('icon')->icon('star-empty') !!}
								@endif


							@endfor
						</p>
						{!! BootForm::range(trans('dealing.price'), 'stuff[' . $stuff->getId() . '][price]')
							->min(floor($stuff->getPrice() * $minPrice))->max(ceil($stuff->getPrice() * $maxPrice))->value($stuff->getPrice()) !!}

						{!! BootForm::range(trans('dealing.count'), 'stuff[' . $stuff->getId() . '][count]')
							->min(0)->max($stuff->getCount()) !!}

					</div>


				</div>
				@endforeach

				<div class="col-xs-6 col-xs-offset-3">

					<p><strong>@lang('dealing.energy'):</strong> {{ $energy }}</p>
					<p><strong>@lang('dealing.duration'):</strong> {{ Formatter::time($duration) }}</p>
					{!! BootForm::submit(trans('dealing.sell'), 'btn-primary')->addClass('center-block')->id('dealing-button') !!}

				</div>

			</div>


			{!! BootForm::close() !!}


		</div>

	</div>
</div>

<script>
	
$(function() {


	$('.dealing-stuff').change(function() {

		var id = $(this).data('id');
		var data = $('#dealing-stuff-' + id);
		var button = $('#dealing-button');

		if($(this).is(':checked')) {

			data.show();
		}
		else {

			data.hide();
		}

		if($('.dealing-stuff:checked').length > 0) {

			button.removeAttr('disabled');
		}
		else {

			button.attr('disabled', 'disabled');
		}

	}).trigger('change');
});
</script>

