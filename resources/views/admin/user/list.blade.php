@extends('app')



@section('content')

<?php $current = Auth::user(); ?>

<div class="panel panel-default">

	<div class="panel-heading">

		<h2 class="text-center">Użytkownicy</h2>
	</div>

	<div class="panel-body">

		<table class="table table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>E-mail</th>
					<th>Newsletter</th>
					<th>Zweryfikowany</th>
					<th>Język</th>
					<th>Punkty premium</th>
					<th>Konto premium</th>
					<th>Utworzono</th>
					<th>Ostatnia aktywność</th>
					<th>Facebook</th>
					<th>Zbanowany</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
	
				@foreach($users as $user)

					<tr>
						<td>{{ $user->id }}</td>
						<td>{{ $user->email }}</td>
						<td class="{{ $user->newsletter ? 'success' : 'danger' }}">{{ $user->newsletter ? 'Tak' : 'Nie' }}</td>
						<td class="{{ $user->verified ? 'success' : 'danger' }}">{{ $user->verified ? 'Tak' : 'Nie' }}</td>
						<td>@lang('lang.' . $user->language)</td>
						<td>{{ $user->premiumPoints }}</td>
						<td>
							{{ is_null($user->premiumStart) || is_null($user->premiumEnd) ? 
								'Brak' : 
								date('Y-m-d H:i:s', $user->premiumStart) . ' - ' . date('Y-m-d H:i:s', $user->premiumEnd) }}
						</td>
						<td>{{ $user->created_at }}</td>
						<td>{{ $user->updated_at }}</td>
						<td class="{{ !is_null($user->facebook) ? 'success' : 'danger' }}">

							{{ !is_null($user->facebook) ? 'Tak' : 'Nie' }}
						</td>

						<td class="{{ $user->isBanned ? 'danger' : 'success' }}">

							{{ $user->isBanned ? date('Y-m-d H:i:s', $user->banEnd) : 'Nie' }}
						</td>

						<td>
							
							@if($user->id !== $current->id && !$user->admin)

								{!! BootForm::open()->post()->action(route('admin.user.login'))->addClass('form-inline') !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('user')->value($user->id) !!}
								{!! BootForm::submit('Zaloguj jako', 'btn-default') !!}

								{!! BootForm::close() !!}

								<button class="btn btn-default" type="button" data-toggle="modal" data-target="#banModal"
									data-user-id="{{ $user->id }}" data-user-email="{{ $user->email }}">Zbanuj</button>

							@endif

						</td>
					</tr>



				@endforeach



			</tbody>

			<tfooter>

				<tr><td colspan="12">{!! $users->render() !!}</td></tr>
			</tfooter>
		</table>

		<a href="{{ route('admin.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>
	</div>
</div>



<div class="modal fade" id="banModal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">Banowanie</h4>
			</div>
			<div class="modal-body">
				
				{!! BootForm::openHorizontal(['xs' => [4, 8]])->post()->action(route('admin.user.ban')) !!}
				{!! BootForm::token() !!}

				{!! BootForm::staticInput('Użytkownik')->id('banUserEmail') !!}

				{!! BootForm::hidden('user')->id('banUserId') !!}
				{!! BootForm::select('Powód', 'reason')->options(trans('user.ban'))->required() !!}

				{!! BootForm::duration('Czas trwania', 'duration')->required() !!}
				{!! BootForm::submit('Zbanuj', 'btn-primary') !!}

				{!! BootForm::close() !!}
			</div>
		</div>
	</div>
</div>







@endsection

@section('scripts')
@parent

<script type="text/javascript">
	
$(function() {

	$('#banModal').on('show.bs.modal', function(event) {

		var id = $(event.relatedTarget).data('user-id');
		var email = $(event.relatedTarget).data('user-email');

		$(this).find('#banUserId').val(id);
		$(this).find('#banUserEmail').text(email);
	});
});


</script>


@endsection