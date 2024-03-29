@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">

		@if(isset($npc))

			<h2>{{ $npc->name }} -- Edycja</h2>
		@else

			<h2>Nowy Npc</h2>
		@endif
	</div>

	<div class="panel-body">


	@if(isset($npc))

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->put()->action(route('admin.npc.update', ['npc' => $npc->id]))->enctype('multipart/form-data') !!}
	@else

		{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.npc.store'))->enctype('multipart/form-data') !!}
	@endif



	{!! BootForm::text('<strong>Nazwa</strong>', 'name')->defaultValue(isset($npc) ? $npc->name : null)->required() !!}


	<?php $image = BootForm::image('<strong>Obrazek</strong>', 'image')->defaultValue(isset($npc) ? $npc->getImage() : null); ?>

	@if(!isset($npc))

		<?php $image->required(); ?>
	@endif

	{!! $image !!}


	@foreach($quests as $quest)

		<?php $checkbox = BootForm::checkbox($quest->getTitle(), 'quest[' . $quest->getName() . ']'); ?>

		@if(isset($npc) && array_search($quest->getName(), $npc->quests) !== false)

			<?php $checkbox->check(); ?>

		@endif

		{!! $checkbox !!}


	@endforeach




	<div class="col-xs-offset-4">

		@if(isset($npc))

			<a class="btn btn-danger" href="{{ route('admin.npc.show', ['npc' => $npc->id]) }}">{!! entity('icon')->icon('remove') !!}</a>
		@else

			<a class="btn btn-danger" href="{{ route('admin.npc.index') }}">{!! entity('icon')->icon('remove') !!}</a>
		@endif

		<button type="submit" class="btn btn-success">

			{!! entity('icon')->icon('ok') !!}
		</button>

	</div>

	{!! BootForm::close() !!}

	</div>
</div>

@endsection
