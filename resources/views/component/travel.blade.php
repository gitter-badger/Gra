<div data-tutorial="true" data-tutorial-name="travel">
	<h4><strong>@lang('travel.title')</strong></h4>
	<div class="well text-center">
		<div class="row equalize">

			@foreach($locations as $location)

				<?php $distance = $current->getDistanceTo($location); ?>

				<div class="col-xs-12 col-sm-6 col-md-4">

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}

					{!! BootForm::hidden('action')->value('travel') !!}
					{!! BootForm::hidden('location')->value($location->id) !!}


					

					<button type="submit" class="btn btn-block tutorial-step" style="padding: 0; border: 0"
						data-tutorial-index="0" title="@lang('tutorial.travel.travel.title')" data-content="@lang('tutorial.travel.travel.content')">
							

						<img class="img-responsive center-block" src="{{ $location->getImage() }}" style="width: 100%"/>

						<div class="panel text-wrap no-padding no-margin">

							<div class="panel-body">

								<h4>@lang('location.' . $location->name . '.name')</h4>

								<p><strong>@lang('travel.distance'):</strong> {{ $distance }}km</p>
								<p><strong>@lang('travel.duration'):</strong> {{ Formatter::time(round($distance * $speed)) }}</p>
								<p><strong>@lang('travel.cost'):</strong> {{ Formatter::money(round($distance * $cost)) }}</p>
							</div>

						</div>
					</button>

					{!! BootForm::close() !!}
					

				</div>

			@endforeach


		</div>
	</div>
</div>