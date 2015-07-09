@extends('app')


@section('content')


<div class="panel panel-default">
	<div class="panel-heading">
		
		<h2>{{ $shop->name }} -- Podgląd</h2>
	</div>

	<div class="panel-body">




	<?php $list = '<ul class="list-group">'; ?>
	@foreach($deliveries as $delivery)


		<?php 

		$list .= '<li class="list-group-item"><a href="' . route('admin.shop.delivery.show', ['shop' => $shop->id, 'delivery' => $delivery->id]) . '">' 
			. $delivery->item->getTitle() . ' <span class="badge">' . $delivery->count . '</span></a>';


		$list .= '<div class="pull-right">';


		$list .= '<a class="btn btn-info" href="' . route('admin.shop.delivery.show', ['shop' => $shop->id, 'delivery' => $delivery->id]) . '">'
			. entity('icon')->icon('eye-open') . '</a>';



		$list .= '<a class="btn btn-primary" href="' . route('admin.shop.delivery.edit', ['shop' => $shop->id, 'delivery' => $delivery->id]) . '">'
			. entity('icon')->icon('pencil') . '</a>';


		$list .= BootForm::open()->delete()->action(route('admin.shop.delivery.destroy', ['shop' => $shop->id, 'delivery' => $delivery->id]))->addClass('form-inline');
		$list .= BootForm::token();
		$list .= BootForm::submit(entity('icon')->icon('trash'), 'btn-danger');
		$list .= BootForm::close();


		$list .= '</div><div class="clearfix">';


		$list .= '</li>';

		?>

	@endforeach
	<?php 

	$list .= '</ul>'; 



	$list .= '<div class="pagination-fix pull-left">';

	$list .= $deliveries->render();

	$list .= '</div>';


	$list .= '<a class="btn btn-success pull-left" href="' . route('admin.shop.delivery.create', ['shop' => $shop->id]) . '">';
	$list .= entity('icon')->icon('plus');
	$list .= '</a>';
	$list .= '<div class="clearfix"></div>';

	?>




	{!! BootForm::openHorizontal(['xs' => [4, 8]]) !!}


	{!! BootForm::staticInput('<strong>Nazwa</strong>')->value($shop->name) !!}


	{!! BootForm::staticInput('<strong>Dostawy</strong>')->value($list) !!}



	{!! BootForm::close() !!}

	<div class="col-xs-offset-4">

		<a href="{{ route('admin.shop.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
		<a href="{{ route('admin.shop.edit', ['shop' => $shop->id]) }}" class="btn btn-primary">{!! entity('icon')->icon('pencil') !!}</a>

		{!! BootForm::open()->delete()->action(route('admin.shop.destroy', ['shop' => $shop->id]))->addClass('form-inline') !!}
		{!! BootForm::token() !!}

		{!! BootForm::submit(entity('icon')->icon('trash'), 'btn-danger') !!}

		{!! BootForm::close() !!}
	</div>

	</div>
</div>

@endsection