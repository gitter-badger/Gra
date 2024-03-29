@extends('app')


@section('content')

{!! $player->renderEvents() !!}

<div class="panel panel-default">
	<div class="panel-body">

	<div class="row">
		<div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 text-center">

			<h4>@lang('job.' . $player->jobName)</h4>

			<div data-help="@lang('help.job.progress')">
			
				{!! entity('timer')
					->min($player->jobStart)
					->max($player->jobEnd)
					->now(time())
					->reversed(true)

				!!}
			</div>

			@if($player->jobBreakable)

			{!! BootForm::open()->post() !!}
			{!! BootForm::token() !!}

			{!! BootForm::hidden('action')->value('break') !!}
			{!! BootForm::submit(trans('action.break'), 'btn-success')->addClass('center-block') !!}

			{!! BootForm::close() !!}
			


			@endif


		</div>
	</div>


	</div>
</div>

@endsection
