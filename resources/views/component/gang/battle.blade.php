

<div class="panel panel-default">
	<div class="panel-body text-center">


		<?php $members = $gang->members()->with('player')->get(); ?>
		<ul class="list-group">
		@foreach($members as $member)

			<li class="list-group-item list-group-item-{{ $member->joins ? 'success' : 'danger' }}">{{ $member->player->name }}</li>
		@endforeach
		</ul>


		{!! entity('timer')
			->min($gang->startAttack)
			->max($gang->endAttack)
			->now(time())
			->reversed(time()) !!}



		@if($player->member->joins)

			<p>@lang('gang.joined')</p>
		@else

			{!! BootForm::open()->post() !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('action')->value('join') !!}

			{!! BootForm::submit(trans('action.join'), 'btn-primary') !!}

			{!! BootForm::close() !!}

		@endif
	</div>
</div>