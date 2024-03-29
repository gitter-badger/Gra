@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-body">

		{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}

		{!! BootForm::staticInput('<strong>' . trans('report.title') . '</strong>')
			->value($report->title) !!}

		{!! BootForm::staticInput('<strong>' . trans('report.date') . '</strong>')
			->value(date('Y-m-d H:i:s')) !!}

		{!! BootForm::staticInput('<strong>' . trans('report.content') . '</strong>')
			->value($report->content) !!}


		{!! BootForm::close() !!}
		
		<div class="col-xs-offset-4">
		
			<a href="{{ route('reports.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>

			{!! BootForm::open()->delete()->action(route('reports.destroy', ['id' => $report->id]))->addClass('form-inline') !!}
			{!! BootForm::token() !!}

			{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

			{!! BootForm::close() !!}
		</div>
	</div>
</div>


@endsection