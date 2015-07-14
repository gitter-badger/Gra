widths =
	xs: 768,
	sm: 992,
	md: 1200,



getPrefix = ->
	width = $(window).width()

	if width < widths.xs
		['xs']
	else if width < widths.sm
		['sm', 'xs']
	else if width < widths.md
		['md', 'sm', 'xs']
	else
		['lg', 'md', 'sm', 'xs']


getColumns = (prefix) ->
	result = []
	for p in prefix
		for i in [1..12]
			result.push("col-#{p}-#{i}")
	result



getSize = (object, prefix) ->
	for p in prefix
		regexp = new RegExp("col-#{p}-(\\d+)")
		size = $(object).attr('class').match(regexp)?[1]
		return parseInt(size) if size?
	return null




equalize = ->
	prefix = getPrefix()
	columns = getColumns(prefix)
	selector = '.' + columns.join(',.')
	
	#console.log('prefix: ', prefix)
	#console.log('columns: ', columns)
	#console.log('selector: ', selector)


	$('.row.equalize').each ->
		#console.log('new row')
		heights = []
		row = 0
		sum = 0

		$(this).children(selector).each ->
			size = getSize(this, prefix)
			sum += size

			#console.log('size: ', size)
			#console.log('sum: ', sum)

			if sum > 12
				sum -= 12
				row++
				#console.log('next row ', row, size)

			heights[row] ?= 0
			heights[row] = Math.max(heights[row], $(this).height())
			#console.log('height ', heights[row])

		row = 0
		sum = 0
		col = null

		$(this).children(selector).each ->
			sum += getSize(this, prefix)
			col ?= this

			if sum > 12
				sum -= 12
				row++
				col = this

			$(this).height(heights[row])

		hs = Math.round (12 - sum) / 2
		if col? and hs > 0
			p = prefix[0]

			for i in [1..12]
				$(col).removeClass("col-#{p}-offset-#{i}")
			$(col).addClass("col-#{p}-offset-#{hs}")




$ ->
	$(window).resize -> equalize()
	equalize()