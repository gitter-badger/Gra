
square = ->

	$('.square').each ->

		if $(this).data('square') == 'width'

			$(this).width $(this).height()
		else

			$(this).height $(this).width()

$ ->
	$(window).resize -> 
		square()
		
	square()