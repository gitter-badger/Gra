$ ->
	$('[data-toggle="tooltip"]').each(->

		options = {

			html: true,
			placement: 'auto left'
		}

		trigger = $(this).data('trigger')

		if trigger?
			options.trigger = trigger


		$(this).tooltip(options)
	)