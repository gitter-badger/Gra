

update = () ->

	date = new Date()
	now = Math.round(date.getTime() / 1000)
	$('.current-time').text(date.toUTCString())

	$('.time-left').each(->

		to = $(this).data('to')
		$(this).text(window.timeFormat(Math.max(to - now, 0)))
	)


	setTimeout(update, 1000)



$ ->
	update()