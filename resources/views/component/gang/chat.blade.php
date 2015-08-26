<div class="panel panel-default">
	<div class="panel-body">

	<div class="chat">

		<div class="form-control output"></div>
		


		<div class="input-group input-bar">

			<span class="input-group-addon">

				<strong>{{ $player->name }}: </strong>
			</span>

			<input type="text" class="form-control input"/>

			<span class="input-group-btn">

				<button type="button" class="btn btn-default emoticons">:)</button>
			</span>

			<span class="input-group-btn">

				<button type="button" class="btn btn-default send" data-text="@lang('action.send')"></button>
			</span>

		</div>

	</div>



	</div>
</div>


<script type="text/javascript">
	
	$(function() {

		var element = $('.chat');
		var options = {

			messageUrl: '',
			playerUrl: '{{ urldecode(route('player.doReference')) }}',

			interval: {{ $interval }},
			history: {{ $history }},
			cooldown: {{ $cooldown }},
			minLength: {{ $minLength }},
			maxLength: {{ $maxLength }},
			join: {{ $join }},

			allowSend: {{ $player->member->can(\HempEmpire\GangMember::PERMISSION_CHAT_WRITE) ? 'true' : 'false' }}, 
			allowReceive: {{ $player->member->can(\HempEmpire\GangMember::PERMISSION_CHAT_READ) ? 'true' : 'false' }}, 

			sendMethod: 'POST',
			receiveMethod: 'POST',

			sendExtra: {action: 'send'},
			receiveExtra: {action: 'receive'},
		};



		var chat = new Chat(element, options);
	});
</script>