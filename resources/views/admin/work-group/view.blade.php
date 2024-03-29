@extends('app')


@section('content')


<div class="panel panel-default">

	<div class="panel-heading">

		<h2>{{ $workGroup->getTitle() }} -- Podgląd</h2>
	</div>

	<div class="panel-body">




	<?php 

	$list = '<ul class="list-group">';

	foreach($works as $work)
	{
		$list .= '<li class="list-group-item"><a href="' . route('admin.workGroup.work.show', ['workGroup' => $workGroup->id, 'work' => $work->id]) . '">' . 
			$work->getTitle() . ' (' . $work->getName() . ')</a>';

		$list .= '<div class="pull-right">';


		$list .= '<a class="btn btn-info" href="' . route('admin.workGroup.work.show', ['workGroup' => $workGroup->id, 'work' => $work->id]) . '">'
			. entity('icon')->icon('eye-open') . '</a>';



		$list .= '<a class="btn btn-primary" href="' . route('admin.workGroup.work.edit', ['workGroup' => $workGroup->id, 'work' => $work->id]) . '">'
			. entity('icon')->icon('pencil') . '</a>';


		$list .= BootForm::open()->delete()->action(route('admin.workGroup.work.destroy', ['workGroup' => $workGroup->id, 'work' => $work->id]))->addClass('form-inline');
		$list .= BootForm::token();
		$list .= BootForm::submit(entity('icon')->icon('trash'), 'btn-danger');
		$list .= BootForm::close();


		$list .= '</div><div class="clearfix">';


		$list .= '</li>';
	}
	$list .= '</ul>';


	$list .= '<div class="pagination-fix pull-left">';

	$list .= $works->render();

	$list .= '</div>';


	$list .= '<a class="btn btn-success pull-left" href="' . route('admin.workGroup.work.create', ['workGroup' => $workGroup->id]) . '">';
	$list .= entity('icon')->icon('plus');
	$list .= '</a>';
	$list .= '<div class="clearfix"></div>';
	?>


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


	{!! BootForm::staticInput('<strong>Nazwa surowa</strong>')->value($workGroup->getName()) !!}
	{!! BootForm::staticInput('<strong>Nazwa wywietlana</strong>')->value($workGroup->getTitle()) !!}

	{!! BootForm::staticInput('<strong>Prace</strong>')->value($list) !!}
	





	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.workGroup.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.workGroup.edit', ['workGroup' => $workGroup->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.workGroup.destroy', ['workGroup' => $workGroup->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection