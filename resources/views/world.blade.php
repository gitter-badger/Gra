@extends('app')


@section('content')

<div class=" [ worldPanelF ] panel panel-default">
	<div class="panel-body">

	   <div class="row">	
	   		<div class=" [ infoPanelF ] col-md-3 col-md-offset-2">
				<div class=" [ infoPanelF__caption ] ">Info Panel</div>
				<p class=" [ infoPanelF__text ] ">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam dolor reiciendis, molestias beatae magni, impedit quos hic unde, cumque modi omnis a iure, quas laudantium. Assumenda nulla deserunt impedit nihil.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus magni, soluta enim voluptas beatae aspernatur consequuntur atque provident tempora assumenda aperiam optio ipsam repudiandae eaque cum quasi, molestiae ipsum blanditiis.
				</p>
	   		</div>
		   	
		   	<div class="col-md-3 ">

		   		<div class="list-group">
		   		<div class=" [ worldPanelF__selectWorld ] ">Wybierz swój świat</div>
				@foreach($worlds as $world)

					<a href="{{ route('game', ['server' => 's' . $world->id]) }}"
						class="[ worldPanelF__item ] 
						list-group-item 
						btn 
						btn-{{ 
						$world->isSelected() ? 'primary active [ worldPanelF__active ]' : 
						($world->hasCharacter() ? 'default [ worldPanelF__default ] list-group-item-success' : 'default [ worldPanelF__default ] ') }}{{ 
						$world->isAvailable() ? '' : 'disabled [ worldPanelF__disabled ]' }}">

						<p>@lang('world.' . $world->id) <span class=" [ worldPanelF__badge ] ">{{ $world->population }}</span></p>
					</a>

				@endforeach
				</div>

		   	</div>
	   </div>

	</div>
</div>

@endsection