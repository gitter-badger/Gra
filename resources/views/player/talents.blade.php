@extends('player.base')


@section('tab-content')


<div class="row">
	
	@foreach($trees as $tree => $talents)

		<div class="col-xs-12 col-sm-4">
			
			<div class="panel panel-default">
				
				<div class="panel-heading">@lang('talent.tree.' . $tree)</div>
				<div class="panel-body">

					<div class="row">

						@foreach($talents as $talent => $data)

							<div class="col-xs-4">
						
								<?php $tooltip = '<div class=\'text-center\'>';

								$requirements = new HempEmpire\Requirements(Config::get('talents.' . $tree . '.' . $talent . '.requires', []));

								$tooltip .= '<h4>' . trans('talent.' . $talent . '.name') . '</h4>';
								$tooltip .= '<p>' . trans('talent.' . $talent . '.description') . '</p>';
								$tooltip .= str_replace('"', '\'', $requirements->render($player));

								$tooltip .= '</div>';
								?>




								@if($player->hasTalent($talent))

								<button type="button" class="btn btn-success active btn-block" data-toggle="tooltip" title="{!! $tooltip !!}">
									
									<img src="{{ asset('images/talents/' . Config::get('talents.' . $tree . '.' . $talent . '.image')) }}" class="img-responsive center-block"/>

								</button>
								@else

								{!! BootForm::open()->post() !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('talent')->value($talent) !!}

								<button type="submit" class="btn btn-default btn-block" data-toggle="tooltip" title="{!! $tooltip !!}">
									
									<img src="{{ asset('images/talents/' . Config::get('talents.' . $tree . '.' . $talent . '.image')) }}" class="img-responsive center-block"/>

								</button>

								{!! BootForm::close() !!}

								@endif
							</div>

						@endforeach

					</div>

				</div>
			</div>


		</div>
	

	@endforeach

</div>

<div class="row">
	<div class="col-xs-12">
				
		<div class="text-center">

			<h4>@lang('statistic.talentPoints')</h4>
			<p>{{ $player->talentPoints }}</p>

		</div>
	</div>
</div>



@endsection