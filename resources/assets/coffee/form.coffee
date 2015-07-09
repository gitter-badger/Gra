speed = 1


keyDown = (event) ->
	speed = 10 if event.which == 17
	speed = 100 if event.which == 16

keyUp = (event) ->
	speed = 1 if event.which == 17 or event.which == 16


mouseWheel = (event) ->
	min = parseInt ($(this).attr('min') ? 0)
	max = parseInt ($(this).attr('max') ? 100)
	step = parseInt ($(this).attr('step') ? 1)

	change = event.deltaY * step * speed
	value = parseInt $(this).val() ? 0
	value = Math.clamp value + change, min, max

	$(this)
		.val value
		.trigger 'change'

	event.preventDefault()

rangeChanged = (event) ->
	output = $(this).parent().children('.range-value')
	before = ($(output).data 'before') ? ''
	after = ($(output).data 'after') ? ''
	value = $(this).val() ? 0

	$(output).text before + value + after


numberDecrease = (event) ->
	input = $(this).parent().parent().children('input')
	min = parseInt ($(input).attr('min') ? 0)
	max = parseInt ($(input).attr('max') ? 100)
	step = parseInt ($(input).attr('step') ? 1)

	value = parseInt ($(input).val() ? 0)
	value = Math.clamp(value - speed * step, min, max)
	$(input).val(value).trigger('change')


numberIncrease = (event) ->
	input = $(this).parent().parent().children('input')
	min = parseInt ($(input).attr('min') ? 0)
	max = parseInt ($(input).attr('max') ? 100)
	step = parseInt ($(input).attr('step') ? 1)

	value = parseInt ($(input).val() ? 0)
	value = Math.clamp(value + speed * step, min, max)
	$(input).val(value).trigger('change')




$ -> (

	$(window)
		.keyup keyUp
		.keydown keyDown

	$('input[type=number], input[type=range]')
		.bind 'mousewheel', mouseWheel

	$('input[type=range]')
		.change rangeChanged
		.mousemove rangeChanged

	$('.number-minus').children('button')
		.click numberDecrease


	$('.number-plus').children('button')
		.click numberIncrease

)