

<div class='media text-center'>


	<div class='media-left media-middle'>

		<img class='media-object item-icon' src='{{ $item->getImage() }}'/>
	</div>

	<div class='media-body'>

		<h4 class='media-heading'><strong>{{ $item->getTitle() }}</strong></h4>
		<p>{{ $item->getDescription() }}</p>

	</div>
</div>

<div class='row text-center'>
	<div class='col-xs-6'>

		<p><strong>@lang('item.type'): </strong><br/> {{ trans('item.types.' . $item->getType()) }}</p>
	</div>

	<div class='col-xs-6'>

		<p><strong>@lang('item.count'): </strong><br/> {{ $item->getCount() }}</p>
	</div>

	<div class='col-xs-6'>

		@if($item->isPremium())

			<p><strong>@lang('item.price'): </strong><br/> {{ $item->getPrice() }}pp</p>

		@else

			<p><strong>@lang('item.price'): </strong><br/> ${{ $item->getPrice() }}</p>
		@endif
	</div>

	<div class='col-xs-6'>

		<p><strong>@lang('item.weight'): </strong><br/> {{ $item->getWeight() }}</p>
	</div>

	@if(!isset($typeDetails) || $typeDetails == true)

		@include('details.' . $item->getType())
	@endif

</div>
