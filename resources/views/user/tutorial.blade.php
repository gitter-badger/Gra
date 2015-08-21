@extends('user.base')


@section('tab-content')

<div class="row">
@foreach($tutorials as $tutorial)

	<div class="col-xs-4">@lang('tutorial.' . $tutorial->name . '.name')</div>
	<div class="col-xs-8">
		
		{!! BootForm::open()->post()->addClass('form-inline') !!}
		{!! BootForm::token() !!}
		{!! BootForm::hidden('action')->value('reset') !!}
		{!! BootForm::hidden('tutorial')->value($tutorial->name) !!}

		{!! BootForm::submit(trans('action.reset'), 'btn-default') !!}
		{!! BootForm::close() !!}

		@if($tutorial->active)

			{!! BootForm::open()->post()->addClass('form-inline') !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('action')->value('disable') !!}
			{!! BootForm::hidden('tutorial')->value($tutorial->name) !!}

			{!! BootForm::submit(trans('action.disable'), 'btn-danger') !!}
			{!! BootForm::close() !!}


		@else


			{!! BootForm::open()->post()->addClass('form-inline') !!}
			{!! BootForm::token() !!}
			{!! BootForm::hidden('action')->value('enable') !!}
			{!! BootForm::hidden('tutorial')->value($tutorial->name) !!}

			{!! BootForm::submit(trans('action.enable'), 'btn-success') !!}
			{!! BootForm::close() !!}


		@endif



	</div>

@endforeach
</div>



@endsection