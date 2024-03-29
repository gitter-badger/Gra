@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		<h2>{{ $npc->name }} -- Podgląd</h2>
	</div>

	<div class="panel-body">




	<?php $list = '<ul class="list-group">'; ?>
	@foreach($npc->quests as $quest)

		
		<?php $list .= '<li class="list-group-item">' . trans('quest.' . $quest . '.name') . ' (' . $quest . ')</li>'; ?>
		

	@endforeach
	<?php $list .= '</ul>'; ?>



	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


	{!! BootForm::staticInput('<strong>Nazwa</strong>')->value($npc->name) !!}


	<?php $image = '<img class="img-responsive center-block" src="' . $npc->getImage() . '"/>'; ?>

	{!! BootForm::staticInput('<strong>Obrazek</strong>')->value($image) !!}
	{!! BootForm::staticInput('<strong>Zadania</strong>')->value($list) !!}



	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.npc.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.npc.edit', ['npc' => $npc->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.npc.destroy', ['npc' => $npc->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection