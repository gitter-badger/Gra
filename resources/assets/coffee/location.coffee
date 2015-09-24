


$(->

	$('.location-pin').each( ->

		$(this).popover({

			title: $(this).data('name')
			content: $(this).data('desc')
			placement: 'auto'
			trigger: 'hover'
			delay: 
				show: 750
				hide: 0
		})
	)
)