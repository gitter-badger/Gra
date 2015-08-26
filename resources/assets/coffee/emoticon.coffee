


class @Emoticons

	defaults = {

		emoticons: {

			';)': 'blink.png',
			':D': 'grin.png',
			':(': 'sad.png',
			':)': 'smile.png',
			'B)': 'sunglasses.png',
			'O.o': 'surprised.png',
			':p': 'tongue.png', 
		},

		url: '/images/emoticons/{name}',
	}



	constructor: (url, emoticons) ->

		@url = url ? defaults.url
		@set = $.extend({}, defaults.emoticons, emoticons ? {})


	insert: (text) ->

		for k, v of @set

			url = @url.replace('{name}', v)
			emoticon = '<img class="emoticon" src="' + url + '" alt="' + k + '" title="' + k + '"/>'
			text = text.replaceAll(k, emoticon)


		text

	popover: (button, output) ->

		$(button).popover({

			html: true,
			trigger: 'click',
			placement: 'top',
			title: i18n.emoticons.title,
			content: => @getPopoverContent(output),
			template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content emoticon-container"></div></div>',
		})

	getPopoverContent: (output) ->

		container = $('<div></div>')

		for k, v of @set
			url = @url.replace('{name}', v)
			img = $('<img></img>')
				.addClass('emoticon')
				.attr('src', url)
				.attr('alt', k)
				.attr('title', k)
				.click(->

					$(output).val($(output).val() + $(this).attr('alt'))
				)

			$(container).append(img)

		return container









counter = 0


$(->

	emoticons = new Emoticons()

	$('[data-emoticons=true]').each(->

		text = $(this).text()
		text = emoticons.insert(text)
		$(this).html(text)
	)
)