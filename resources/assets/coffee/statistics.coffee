
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



$ -> 
	$('.statistic')
		.bind 'keyup input change', changed
		.trigger 'change'
