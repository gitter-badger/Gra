
refreshing = false

refresh = ->
	window.location.refresh() if not refreshing
	refreshing = true

update = (timer) ->
	bar = $(timer).children('.progress-bar').last()
	label = $(timer).children '.progress-label'
	time = Math.round (new Date).getTime() / 1000.0


	min = $(bar).data 'min'
	max = $(bar).data 'max'
	stop = $(bar).data 'stop'
	ca = $(bar).data('ca')
	cb = $(bar).data('cb')



	reversed = Boolean($(bar).data('reversed') ? false)
	reload = Boolean($(bar).data('reload') ? true)

	if stop?
		time = Math.min time, stop

	now = Math.clamp(time, min, max)


	percent = (now - min) / (max - min)
	percent = 1 - percent if reversed




	$(bar).css 'width', (percent * 100) + '%'
	$(bar).css('background-color', Math.lerpColors(percent, ca, cb)) if ca? and cb?
	$(label).text window.timeFormat? max - now

	refresh() if time > max and reload

	setTimeout -> update timer, 1000 #if time <= max


$ ->
	$('.progress-time').each ->
		update this




