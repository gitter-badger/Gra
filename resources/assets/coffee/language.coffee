

set = (lang) ->
	window.location.href = '/lang/' + lang





button = () ->
	set($(this).data('lang'))


select = () ->
	set($(this).val())



$ ->
	$('.language-select').change(select)
	$('.language-button').click(button)
