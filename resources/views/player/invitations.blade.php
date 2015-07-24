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
					
					{!! BootForm::open()->post()->action(route('player.accept')) !!}
					{!! BootForm::token() !!}
					{!! BootForm::hidden('invitation')->value($invitation->id) !!}
						

					{!! BootForm::submit(trans('action.accept'), 'btn-primary') !!}

					{!! BootForm::close() !!}
				</td>
			</tr>
			@endforeach
		</tbody>
	</table>
</div>



@endsection