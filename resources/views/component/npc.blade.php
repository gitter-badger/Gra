<div class="well">

	<div class="row">

		<div class="col-xs-4">

			<img class="img-responsive center-block" src="{{ $npc->getImage() }}"/>

		</div>

		<div class="col-xs-8">

			<div class="panel panel-default">
				<div class="panel-body text-center">

					@if(isset($npc->quest))
						<h4><strong>{{ $npc->quest->getTitle() }}</strong></h4>
						<p>{{ $npc->quest->getDescription() }}</p>

						@if(isset($quest) && $quest->active)


							<div class="center-block">
								@if($quest->check())

									{!! BootForm::open()->post()->addClass('form-inline') !!}
									{!! BootForm::token() !!}

									{!! BootForm::hidden('action')->value('complete') !!}
									{!! BootForm::submit(trans('action.complete'), 'btn-primary') !!}

									{!! BootForm::close() !!}

								@else

									{!! BootForm::open()->addClass('form-inline') !!}

									{!! BootForm::submit(trans('action.complete'), 'btn-primary')->addClass('disabled') !!}

									{!! BootForm::close() !!}


								@endif


								@if($quest->breakable)


								{!! BootForm::open()->post()->addClass('form-inline') !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('action')->value('cancel') !!}
								{!! BootForm::hidden('quest')->value($quest->id) !!}
								{!! BootForm::submit(trans('action.cancel'), 'btn-danger') !!}

								{!! BootForm::close() !!}


								@endif
							</div>


						@else
							<?php $requirements = $npc->quest->getRequirements(); ?>


							@if(!$requirements->check())

							<h5><strong>@lang('quest.requirements')</strong></h5>
							{!! $requirements->render() !!}

							@endif

							<br/>


							<div class="center-block">
							
								@if($requirements->check())

								{!! BootForm::open()->post()->addClass('form-inline') !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('action')->value('accept') !!}
								{!! BootForm::submit(trans('action.accept'), 'btn-success') !!}

								{!! BootForm::close() !!}

								@else

								<span class="btn btn-success disabled">@lang('action.accept')</span>

								@endif
							
								{!! BootForm::open()->post()->addClass('form-inline') !!}
								{!! BootForm::token() !!}

								{!! BootForm::hidden('action')->value('decline') !!}
								{!! BootForm::submit(trans('action.decline'), 'btn-danger') !!}

								{!! BootForm::close() !!}




							</div>

							@endif

						@endif

				</div>
			</div>


		</div>


	</div>

</div>