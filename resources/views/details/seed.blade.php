<div class='col-xs-6'>
	<p><strong>@lang('item.seed.growth'): </strong><br/> {{ Formatter::time(round($item->getGrowth() * $world->timeScale)) }}</p>
</div>
<div class='col-xs-6'>
	<p><strong>@lang('item.seed.watering'): </strong><br/> {{ Formatter::time(round($item->getWatering() * $world->timeScale)) }}</p>
</div>
<div class='col-xs-6'>
	<p><strong>@lang('item.seed.harvest'): </strong><br/> {{ $item->getMinHarvest() }} - {{ $item->getMaxHarvest() }}</p>
</div>
<div class='col-xs-6'>
	<p><strong>@lang('item.seed.quality'): </strong><br/>

		@for($i = 0; $i < 5; ++$i)

			@if($i < $item->getQuality())

				{!! entity('icon')->icon('star') !!}
			@else

				{!! entity('icon')->icon('star-empty') !!}
			@endif


		@endfor
	</p>
</div>