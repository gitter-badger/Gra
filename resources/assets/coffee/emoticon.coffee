


class @Emoticons

	defaults = {

		emoticons: {

			';)': 'blink.png',
			':D': 'grin.png',
			':(': 'sad.png',
			':)': 'smile.png',
			'B)': 'sunglasses.png',
			'O.o': 'suprised.png',
			':p': 'tongue.png', 
		},

		url: '/images/emoticons/{name}',
	}



	constructor: (url, emoticons) ->

		@url = url ? defaults.url
		@set = $.extend({}, defaults.emoticons, emoticons ? {})


	insert: (text) ->

		for k, v of @set

			lc = k.toLowerCase()
			uc = k.toUpperCase()
			url = @url.replace('{name}', v)

			emoticon = '<img class="emoticon" src="' + url + '" alt="' + k + '"/>'

			if lc == uc

				text = text
					.replace(lc, emoticon)
			else

				text = text
					.replace(lc, emoticon)
					.replace(uc, emoticon)

		text


counter = 0


$(->

	console.log('Document ready #' + (++counter))

	emoticons = new Emoticons()

	$('[data-emoticons=true]').each(->

		text = $(this).text()
		text = emoticons.insert(text)
		$(this).html(text)
	)
)