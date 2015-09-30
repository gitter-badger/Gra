@extends('player.base')


@section('tab-content')

<div class="well">

	<div class="row">


		@foreach($quests as $quest)
	
			<div class="col-xs-6 col-sm-4 col-md-3">

				<div class="panel panel-default">
					<div class="panel-body text-center">

						<?php $quest->init(); ?>
						<h4><strong>{{ $quest->getTitle() }}</strong></h4>
						<p>{!! $quest->render() !!}</p>


						@if($quest->breakable)


						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}

						{!! BootForm::hidden('quest')->value($quest->id) !!}
						{!! BootForm::submit(trans('action.cancel'), 'btn-danger')->addClass('center-block') !!}

						{!! BootForm::close() !!}


						@endif
					</div>
				</div>


			</div>
		@endforeach


	</div>

	{!! $quests->render() !!}
</div>


@endsection