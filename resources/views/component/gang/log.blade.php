
<div class="panel panel-default">
	<div class="panel-body">

	<?php $logs = $gang->logs()->orderBy('created_at', 'asc')->get(); ?>

	@foreach($logs as $log)

		{!! $log->render() !!}

	@endforeach

	</div>
</div>