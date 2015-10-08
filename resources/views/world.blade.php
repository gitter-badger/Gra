@extends('app')


@section('content')

<div class="worldPanelF panel panel-default">
	<div class="panel-body">

	   <div class="row">
		   	<div class="col-md-6 col-md-offset-3">

		   		<div class="list-group">
				@foreach($worlds as $world)

					<a href="{{ route('game', ['server' => 's' . $world->id]) }}"
						class="list-group-item btn btn-{{ $world->isSelected() ? 'primary active' : ($world->hasCharacter() ? 'success list-group-item-success' : 'default') }}{{ $world->isAvailable() ? '' : ' disabled' }}">

						<p>@lang('world.' . $world->id) <span class="worldPanelF__badge">{{ $world->population }}</span></p>
					</a>

				@endforeach
				</div>

		   	</div>
	   </div>

	</div>
</div>

@endsection