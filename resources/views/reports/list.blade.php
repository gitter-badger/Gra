@extends('app')


@section('content')

<div class="panel panel-default">
	<div class="panel-body">

		<table class="raportsTableF table table-hover">
			<thead class="raportsTableF__thead">
				<tr class="raportsTableF__thead__tr">
					<th class="raportsTableF__thead__th">@lang('report.title')</th>
					<th class="raportsTableF__thead__th">@lang('report.date')</th>
					<th ></th>
				</tr>
			</thead>
			<tbody>
				
				@forelse($reports as $report)


				<tr{!! $report->readed ? '' : ' class="unreaded"' !!}>
					<td>

						{!! $report->title !!}
					</td>
					<td>{{ date('Y-m-d H:i:s', $report->date) }}</td>
					<td>
						
						{!! BootForm::open()->get()->action(route('reports.show', ['id' => $report->id]))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('eye-open'), 'btn-primary') !!}

						{!! BootForm::close() !!}

						{!! BootForm::open()->delete()->action(route('reports.destroy', ['id' => $report->id]))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

						{!! BootForm::close() !!}
					</td>
				</tr>

				@empty

				<tr>
					<td colspan="3" class="text-center">@lang('report.empty')</td>
				</tr>

				@endforelse

			</tbody>

			<tfoot class="raportsTableF__tfoot">
				<tr>
					<td colspan="2" class="text-center">
						
						<div class="pagination-fix">
						
							{!! $reports->render() !!}
						</div>
					</td>
					<td>
						{!! BootForm::open()->post()->action(route('reports.readAll'))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('eye-open'), 'btn-primary') !!}

						{!! BootForm::close() !!}

						{!! BootForm::open()->post()->action(route('reports.destroyAll'))->addClass('form-inline') !!}
						{!! BootForm::token() !!}

						{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

						{!! BootForm::close() !!}
					</td>
				</tr>
			</tfoot>
		</table>

	</div>
</div>


@endsection