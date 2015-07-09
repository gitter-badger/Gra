@extends('app')


@section('content')


<div class="panel panel-default">

	<div class="panel-heading">

		<h2>{{ $questGroup->name }} -- Podgląd</h2>
	</div>

	<div class="panel-body">




	<?php 

	$list = '<ul class="list-group">';

	foreach($quests as $quest)
	{
		$list .= '<li class="list-group-item"><a href="' . route('admin.questGroup.quest.show', ['questGroup' => $questGroup->id, 'quest' => $quest->id]) . '">' . 
			$quest->getTitle() . ' (' . $quest->getName() . ')</a>';

		$list .= '<div class="pull-right">';


		$list .= '<a class="btn btn-info" href="' . route('admin.questGroup.quest.show', ['questGroup' => $questGroup->id, 'quest' => $quest->id]) . '">'
			. entity('icon')->icon('eye-open') . '</a>';



		$list .= '<a class="btn btn-primary" href="' . route('admin.questGroup.quest.edit', ['questGroup' => $questGroup->id, 'quest' => $quest->id]) . '">'
			. entity('icon')->icon('pencil') . '</a>';


		$list .= BootForm::open()->delete()->action(route('admin.questGroup.quest.destroy', ['questGroup' => $questGroup->id, 'quest' => $quest->id]))->addClass('form-inline');
		$list .= BootForm::token();
		$list .= BootForm::submit(entity('icon')->icon('trash'), 'btn-danger');
		$list .= BootForm::close();


		$list .= '</div><div class="clearfix">';


		$list .= '</li>';
	}
	$list .= '</ul>';


	$list .= '<div class="pagination-fix pull-left">';

	$list .= $quests->render();

	$list .= '</div>';


	$list .= '<a class="btn btn-success pull-left" href="' . route('admin.questGroup.quest.create', ['questGroup' => $questGroup->id]) . '">';
	$list .= entity('icon')->icon('plus');
	$list .= '</a>';
	$list .= '<div class="clearfix"></div>';
	?>


	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


	{!! BootForm::staticInput('<strong>Nazwy</strong>')->value($questGroup->name) !!}

	{!! BootForm::staticInput('<strong>Zadania</strong>')->value($list) !!}
	





	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.questGroup.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.questGroup.edit', ['questGroup' => $questGroup->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.questGroup.destroy', ['questGroup' => $questGroup->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection