

clicked = ->
	$('.avatar').removeClass('active')
	$('#avatar').val($(this).data('avatar'))
	$(this).addClass('active')


$ ->
	$('.avatar').click(clicked).first().trigger('click')