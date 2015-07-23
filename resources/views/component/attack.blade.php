<div>
	<h4>@lang('attack.title')</h4>

	<div class="well text-center">

		<div class="row equalize">


			@foreach($characters as $character)
			<div class="col-xs-6 col-md-4">
				

				{!! BootForm::open()->post() !!}
				{!! BootForm::token() !!}
				{!! BootForm::hidden('action')->value('attack') !!}
				{!! BootForm::hidden('character')->value($character->id) !!}

				<button type="submit" class="btn btn-default btn-block">
				
					<img src="{{ $character->avatar }}" class="img-responsive center-block"/>

					<h4><strong>{{ $character->name }}</strong></h4>
					<p><strong>@lang('statistic.level'): </strong>{{ $character->level }}</p>
				</button>


				{!! BootForm::close() !!}

			</div>
			@endforeach
		</div>


		{!! $characters->render() !!}
	</div>
</div>