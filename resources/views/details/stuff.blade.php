<div class='col-xs-6'>
	<p><strong>@lang('item.stuff.quality'): </strong><br/>


		@for($i = 0; $i < 5; ++$i)

			@if($i < $item->getQuality())

				{!! entity('icon')->icon('star') !!}
			@else

				{!! entity('icon')->icon('star-empty') !!}
			@endif


		@endfor
	</p>
</div>