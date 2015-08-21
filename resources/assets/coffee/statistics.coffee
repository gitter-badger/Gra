
changed = -> 
	current = parseInt ($('#currentStatisticsPoints').text() ? 0)
	left = parseInt $('#statisticsPoints').text()
	old = parseInt ($(this).data('old') ? 0)
	val = parseInt ($(this).val() ? 0)
	diff = val - old

	diff = left if diff > left
	val = old + diff
	left -= diff

	if not isNaN diff

		$(this)
			.val val
			.data 'old', val

		$('#statisticsPoints')
			.text left

		$('.statistic').each ->
			val = parseInt $(this).val() ? 0
			$(this).attr 'max', left + val


random = (min, max) -> Math.round(Math.random() * (max - min) + min)

randomIn = (array) ->
	index = random(0, array.length - 1)
	array[index]





roll = ->

	rollable = $('.statistic.rollable')
	$(rollable).val(0).trigger('change')
	points = parseInt $('#statisticsPoints').text()


	for i in [1..points]

		statistic = randomIn(rollable)
		val = parseInt $(statistic).val()
		$(statistic).val(val + 1)


	$(rollable).trigger 'change'






$ -> 
	$('.statistic')
		.bind 'keyup input change', changed
		.trigger 'change'

	$('.statRoller')
		.click(roll)

	roll()
