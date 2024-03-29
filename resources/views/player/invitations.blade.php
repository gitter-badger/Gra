@extends('player.base')



@section('tab-content')

<div class="table-responsive">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>@lang('gang.name')</th>
				<th>@lang('gang.invitationDate')</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			@foreach($invitations as $invitation)
			<tr>
				<td>{{ $invitation->gang->name }}</td>
				<td>{{ $invitation->created_at }}</td>
				<td>
					
					{!! BootForm::open()->post()->action(route('player.accept'))->addClass('from-inline') !!}
					{!! BootForm::token() !!}
					{!! BootForm::hidden('action')->value('accept') !!}
					{!! BootForm::hidden('invitation')->value($invitation->id) !!}
						

					{!! BootForm::submit(trans('action.accept'), 'btn-primary') !!}

					{!! BootForm::close() !!}
					
					{!! BootForm::open()->post()->action(route('player.accept'))->addClass('from-inline') !!}
					{!! BootForm::token() !!}
					{!! BootForm::hidden('action')->value('reject') !!}
					{!! BootForm::hidden('invitation')->value($invitation->id) !!}
						

					{!! BootForm::submit(trans('action.reject'), 'btn-danger') !!}

					{!! BootForm::close() !!}
				</td>
			</tr>
			@endforeach
		</tbody>
	</table>
</div>



@endsection