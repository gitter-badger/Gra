@extends('app')


@section('content')


{!! BootForm::openHorizontal(['xs' => [2, 10]]) !!}
{!! BootForm::staticInput('<strong>Nazwa</strong>')->value($location->getName()) !!}


<?php $groups = isset($location) ? implode(', ', $location->groups) : ''; ?>

{!! BootForm::staticInput('<strong>Klasy</strong>', 'groups')->value(strlen($groups) > 0 ? $groups : '<span class="text-muted">brak</span>') !!}

{!! BootForm::staticInput('<strong>Pozycja X</strong>', 'x')->value($location->x) !!}
{!! BootForm::staticInput('<strong>Pozycja Y</strong>', 'y')->value($location->y) !!}
<?php $image = '<div class="location"><img class="location-map" src="' . $location->getPlan() . '"/>'; ?>

@foreach($location->places as $place)

	<?php $image .= '<img class="location-pin" src="' . $place->getImage() . '" data-id="' . $place->id  . '" data-created="true" '
		. 'data-x="' . $place->x . '" data-y="' . $place->y . '"/>'; ?>

@endforeach

<?php echo $image . '</div>'; ?>



<div class="row trash">

	@foreach($places as $place)

		@if($location->places()->where('place_id', '=', $place->id)->count() == 0)
		
			<div class="col-xs-2">

				<img class="location-pin" src="{{ $place->getImage() }}" data-id="{{ $place->id }}"/>
				<p style="margin-top: 50px">{{ $place->getName() }}</p>
			</div>
		@endif
	@endforeach


</div>





{!! BootForm::close() !!}

<div class="col-xs-offset-2">

	<a href="{{ route('admin.location.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
	<a href="{{ route('admin.location.edit', ['location' => $location->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

	{!! BootForm::open()->delete()->action(route('admin.location.destroy', ['location' => $location->id]))->addClass('form-inline') !!}
	{!! BootForm::token() !!}

	{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

	{!! BootForm::close() !!}
</div>


@endsection


@section('styles')

@parent

<style>

.trash {
	
	background: rgba(255, 0, 0, 0.3);
	min-height: 100px;
	min-width: 100%;
}

.location-pin {

	-webkit-transform: none;
	   -moz-transform: none;
	    -ms-transform: none;
	     -o-transform: none;
	        transform: none;
}
</style>

@endsection

@section('scripts')

@parent
<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>


<script>

$(function() {

	var locationId = {{ $location->id }};
	var urls = {

		create: '{!! urldecode(route('admin.location.place.store')) !!}',
		update: '{!! urldecode(route('admin.location.place.update')) !!}',
		destroy: '{!! urldecode(route('admin.location.place.destroy')) !!}',
	};


	var update = function(placeId, x, y) {

		var url = urls.update
			.replace('{location}', locationId)
			.replace('{place}', placeId);

		$.ajax({

			type: 'PUT',
			url: url,
			data: {

				x: x,
				y: y,
			}
		});

	};

	var create = function(placeId, x, y) {

		var url = urls.create
			.replace('{location}', locationId)
			.replace('{place}', placeId);


		$.ajax({

			type: 'POST',
			url: url,
			data: {

				placeId: placeId,
				x: x,
				y: y,
			}
		});

	};

	var destroy = function(placeId) {

		var url = urls.destroy
			.replace('{location}', locationId)
			.replace('{place}', placeId);


		$.ajax({

			type: 'DELETE',
			url: url,
			data: {}
		});
	};


	$('.location').droppable({

		accept: '.location-pin',
		drop: function(event, ui) {

			var placeId = $(ui.draggable).data('id');
			var x = ((ui.offset.left + $(ui.draggable).width() / 2) - $(this).offset().left) / $(this).width();
			var y = ((ui.offset.top + $(ui.draggable).height() / 2) - $(this).offset().top) / $(this).height();



			if($(ui.draggable).data('created') == 'true') {

				//alert('Updated x: ' + x + ' y: ' + y);
				update(placeId, x, y);

			}
			else {

				$(ui.draggable).data('created', 'true');
				//alert('Created x: ' + x + ' y: ' + y);

				create(placeId, x, y);
			}
		}
	});

	$('.trash').droppable({

		accept: '.location-pin',
		drop: function(event, ui) {
			
			var placeId = $(ui.draggable).data('id');

			if($(ui.draggable).data('created') == 'true') {

				$(ui.draggable).removeData('created');
				//alert('Deleted');

				destroy(placeId);
			}
		}
	});




	$('.location-pin').draggable({

		revert: 'invalid',
	});

	$('.location-pin[data-created=true]').each(function() {


		var x = $(this).data('x');
		var y = $(this).data('y');

		$(this).css({

			position: 'absolute',
			left: (x * 100) + '%',
			top: (y * 100) + '%',
		});

	});
});

</script>


@endsection