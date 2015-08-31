


$(->

	console.log($(document).size())

	help = false


	size = (element) ->

		{width: $(element).width(), height: $(element).height()}

	position = (element) ->

		$(element).offset()



	show = ->

		if not help

			help = true

			
			mainOverlay = $('<div></div>')
				.attr('id', 'mainOverlay')
				.addClass('overlay')
				.css(size(document))
				.click(hide)
				.hide()



			navOverlay = $('<div></div>')
				.attr('id', 'navOverlay')
				.addClass('overlay')
				.css('position', 'fixed')
				.css('z-index', 100000)
				.css(size('#mainNav'))
				.click(hide)
				.hide()



			console.log($('#mainContent [data-help]'))
			console.log($('#mainNav [data-help]'))




			$('#mainContent [data-help]').each(->

				copy = $(this).clone()
				p = position(this)
				s = size(this)

				$(copy)
					.addClass('helper')
					.css('position', 'absolute')
					.tooltip({placement: 'auto top', title: $(this).data('help')})
					.css(p)
					.css(s)

				$(copy).find('[title]').removeAttr('title')

				$(mainOverlay)
					.append(copy)
			)

			$('#mainNav [data-help]').each(->

				copy = $(this).clone()
				p = position(this)
				s = size(this)

				$(copy)
					.addClass('helper')
					.css('position', 'absolute')
					.tooltip({placement: 'auto top', title: $(this).data('help')})
					.css(p)
					.css(s)

				$(copy).find('[title]').removeAttr('title')

				$(navOverlay)
					.append(copy)
			)

			$('body')
				.append(mainOverlay)
				.append(navOverlay)

			$(mainOverlay).fadeIn()
			$(navOverlay).fadeIn()


	hide = ->

		if help

			help = false
			$('.overlay').fadeOut({complete: ->

				$('.overlay').remove()
			})



	$('#helpBtn').click(->

		show()
	)

	$(document).keydown((event) ->

		hide() if event.which == 27
	)
)