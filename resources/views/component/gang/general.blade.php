<div class="row">
	<div class="col-xs-6 col-xs-offset-3">

		<div class="panel panel-default">
			<div class="panel-body">
				<div class="text-center">

					@if($player->member->can(\HempEmpire\GangMember::PERMISSION_CHANGE_AVATAR))

						{!! BootForm::open()->post()->enctype('multipart/form-data') !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('change') !!}

						{!! BootForm::image(null, 'avatar')->defaultValue($gang->avatar) !!}
						{!! BootForm::submit(trans('action.save'), 'btn-primary')->addClass('center-block') !!}

						{!! BootForm::close() !!}
					@else

						<img class="img-full center-block" src="{{ $gang->avatar }}"/>

					@endif
				</div>
			</div>
		</div>
	</div>
</div>

@if(strlen($gang->publicText) || $player->member->can(\HempEmpire\GangMember::PERMISSION_CHANGE_PUBLIC))
<div class="row">
	<div class="col-xs-6 col-xs-offset-3">

		<div class="panel panel-default">
			<div class="panel-body">
				<div class="text-center">

					@if($player->member->can(\HempEmpire\GangMember::PERMISSION_CHANGE_PUBLIC))

						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('change') !!}

						{!! BootForm::textarea(null, 'public') !!}
						{!! BootForm::submit(trans('action.save'), 'btn-primary')->addClass('center-block') !!}

						{!! BootForm::close() !!}
					@else

					<p>{{ $gang->publicText }}</p>

					@endif
				</div>
			</div>
		</div>
	</div>
</div>
@endif

@if(strlen($gang->privateText) || $player->member->can(\HempEmpire\GangMember::PERMISSION_CHANGE_PRIVATE))
<div class="row">
	<div class="col-xs-6 col-xs-offset-3">

		<div class="panel panel-default">
			<div class="panel-body">
				<div class="text-center">

					@if($player->member->can(\HempEmpire\GangMember::PERMISSION_CHANGE_PRIVATE))

						{!! BootForm::open()->post() !!}
						{!! BootForm::token() !!}
						{!! BootForm::hidden('action')->value('change') !!}

						{!! BootForm::textarea(null, 'private') !!}
						{!! BootForm::submit(trans('action.save'), 'btn-primary')->addClass('center-block') !!}

						{!! BootForm::close() !!}
					@else

					<p>{{ $gang->privateText }}</p>

					@endif
				</div>
			</div>
		</div>
	</div>
</div>
@endif


<div class="row">
	<div class="col-xs-6 col-xs-offset-3">

		<div class="panel panel-default">
			<div class="panel-body">
				<div class="text-center">

					<h4><strong>{{ $gang->name }}</strong></h4>
					<p><strong>@lang('gang.members'): </strong> {{ $gang->members()->count() }}</p>
					<p><strong>@lang('gang.capacity'): </strong> {{ $gang->membersCount }} / {{ $gang->membersLimit }}</p>
					<p><strong>@lang('gang.level'): </strong> {{ $gang->level}} </p>
					<p><strong>@lang('gang.respect'): </strong> {{ $gang->respect}} </p>
					<p><strong>@lang('gang.money'): </strong> ${{ $gang->money}} </p>

					{!! BootForm::open()->post() !!}
					{!! BootForm::token() !!}
					{!! BootForm::hidden('action')->value('leave') !!}

					{!! BootForm::submit(trans('action.leave'), 'btn-danger') !!}

					{!! BootForm::close() !!}
				</div>
			</div>
		</div>
	</div>

</div>