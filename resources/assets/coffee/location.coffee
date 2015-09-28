


$(->

	$('.location-pin').each( ->

		title = $(this).data('name')
		content = $(this).data('desc')
		dangerous = $(this).hasClass('dangerous')

		requires = $(this).data('requires')

		content += requires if requires?

		content += '<div class="bg-warning">' + i18n.place.dangerous + '</div>' if dangerous

		$(this).popover({

			title: title
			content: content
			placement: 'auto'
			trigger: 'hover'
			html: true
			delay: 
				show: 750
				hide: 0
		})
	)
)