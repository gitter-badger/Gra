

class @Chat

	defaults = {

		messageUrl: null,
		playerUrl: null,
		emoticonUrl: null,
		interval: 2,
		history: 0,
		minLength: 1,
		maxLength: 512,
		cooldown: 60,
		join: 120,
	}

	commands = {

		'clear': 'clearOutput',
	}




	constructor: (element, options) ->

		opt = $.extend({}, defaults, options)

		@messageUrl = opt.messageUrl
		@playerUrl = opt.playerUrl
		@emoticons = new Emoticons()



		@input = $(element).find('.input')
		@output = $(element).find('.output')
		@sendBtn = $(element).find('.send')
		@clearBtn = $(element).find('.clear')




		$(@sendBtn).click( =>

			@send()
			@clearInput()
		)

		$(@clearBtn).click( =>

			@clearOutput()
		)

		@interval = opt.interval


		@join = opt.join

		@cooldown = opt.cooldown
		@sent = Math.round((new Date()).getTime() / 1000) - @cooldown

		@touch()
		@time = Math.max(@time - opt.history, 0)


		@update()






	getErrorText: (name, args) ->

		text = i18l.chat.errors[name] ? i18l.chat.errors.unknown

		if args? and typeof(args) == 'object'

			for k, v of args
				text = text.replace(':' + k, v)

		text



	error: (name, args) ->

		alert = $('<div></div>')
			.addClass('alert')
			.addClass('alert-danger')
			.text(@getErrorText(name, args))

		$(@output)
			.append(alert)

	alert: (name, args) ->

		alert(@getErrorText(name, args))




	touch: ->
		@time = Math.round((new Date()).getTime() / 1000)


	send: ->

		now = Math.round((new Date()).getTime() / 1000)
		message = $(@input).val()

		matches = message.match(/^\/(\w+)/i)



		if matches? matches[1]?
			command = matches[1]

			for k, v of commands

				if command.toLowerCase() == k.toLowerCase()

					func = this[v]

					if typeof(func) == 'function'
						func.call(this)
						return

			@error('cmdNotFound', {'name': command})
			return





		if message.length < @minLength
			@alert('tooShort', {'min': @minLength})
			return 

		if message.length > @maxLength
			alert('tooLong', {'max': @maxLength})
			return

		if @sent + @cooldown > now
			@alert('cooldown')
			return



		$.ajax({

			url: @messageUrl,
			success: (data) => @onSent(data),
			data: {message: $(@input).val()},
			dataType: 'json',
			method: 'POST',	
		})

		@sent = now
		$(@sendBtn).data('time', @sent + @cooldown)


	receive: ->

		$.ajax({

			url: @messageUrl,
			data: {time: @time},
			success: (data) => @onReceived(data),
			dataType: 'json',
			method: 'GET',
		})

		@touch()



	clearOutput: ->

		$(@output).empty()


	clearInput: ->

		$(@input).val('')



	getMessage: (data) ->
		$('<p></p>')
			.html(@emoticons.insert(data.message))
			.append(

				$('<small></small>')
					.addClass('chat-time')
					.data('time', data.time)
			)



	newMessage: (data) ->

		row = $('<div></div>')
			.addClass('row')
			.addClass('chat-message')
			.data('time', data.time)
			.data('author', data.author)

		col1 = $('<div></div>')
			.addClass('col-xs-1')

		col2 = $('<div></div>')
			.addClass('col-xs-11')

		if @playerUrl?

			div1 = $('<a></a>')
				.attr('href', @getPlayerUrl(data.author))
				.addClass('chat-author')
		else
		
			div1 = $('<div></div>')
				.addClass('chat-author')



		div2 = $('<div></div>')
			.addClass('chat-content')




		avatar = $('<img></img>')
			.addClass('img-responsive')
			.addClass('chat-avatar')
			.attr('src', data.avatar)


		author = $('<p></p>').append(

			$('<strong></strong>')
				.addClass('chat-name')
				.text(data.author),
		)

		message = @getMessage(data)



		$(div1).append(avatar).append(author)
		$(div2).append(message)
		$(col1).append(div1)
		$(col2).append(div2)
		$(row).append(col1).append(col2)
		$(@output).append(row)


	modifyMessage: (message, data) ->

		$(message).find('.chat-content').append(

			@getMessage(data)
		)



	addMessage: (data)->

		message = $(@output).find('.chat-message').last()

		if message.length == 0
			
			@newMessage(data)
		else

			time = $(message).data('time')
			author = $(message).data('author')

			if author == data.author and (data.time - time) <= @join
				
				@modifyMessage(message, data)
			else

				@newMessage(data)


		message = $(@output).find('.chat-message').last()

		message.scrollTop(message[0].scrollHeight - message.height())




	onSent: (data) ->

		@error(data.reason, data.args) if data.status == 'error'


	onReceived: (data) ->

		for message in data
			@addMessage(message)

	update: ->

		callback = () =>
			@update()

		@receive()
		setTimeout(callback, @interval * 1000)


	getPlayerUrl: (name) ->

		return @playerUrl.replace('{name}', name)

















$(->

	update = () ->

		now = Math.round((new Date()).getTime() / 1000)

		$('.chat .chat-time').each(->

			time = parseInt($(this).data('time'))
			interval = now - time


			if interval < 60
				
				$(this).text('few seconds ago')
			else

				$(this).text(window.timeFormatShort(interval) + ' ago')
		)

		$('.chat .send').each(->

			time = parseInt($(this).data('time'))
			text = $(this).data('text')
			interval = time - now

			if interval > 0

				$(this)
					.text(window.timeFormat(interval))
					.addClass('disabled')
			else

				$(this)
					.text(text)
					.removeClass('disabled')

		)


		setTimeout(update, 1000)

	update()
)