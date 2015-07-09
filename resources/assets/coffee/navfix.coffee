navfix = ->
	height = $('#mainNav').height() + 10
	$('body').css('padding-top', height + 'px')


$ ->
	$(window).resize -> navfix()
	navfix()