

clicked = ->
	$('.avatar').removeClass('active')
	$('#avatar').val($(this).data('avatar'))
	$(this).addClass('active')
	$('.avatar-preview').attr('src', $(this).attr('src'))


$ ->
	$('.avatar').click(clicked).first().trigger('click')