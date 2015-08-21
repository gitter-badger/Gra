config =
	fontSize: 30
	barFontSize: 20
	nameFontSize: 30
	margin: 5



class Character


	constructor: (team, data) ->

		image = new Image()
		image.src = data.avatar
		image.onload = =>
			@avatar = image



		@team = team
		@name = data.name
		@id = data.id
		@level = data.level
		@health = data.health
		@maxHealth = data.maxHealth


	draw: (context, size) ->
		if @team == 'red'
			context.strokeStyle = 'rgba(217, 83, 79, 1)'
			context.fillStyle = 'rgba(217, 83, 79, 0.4)'
		else
			context.strokeStyle = 'rgba(51, 122, 183, 1)'
			context.fillStyle = 'rgba(51, 122, 183, 0.4)'

		context.fillRect(0, 0, size, size)
		context.strokeRect(0, 0, size, size)

		if @avatar?
			context.drawImage(@avatar, config.margin, config.margin, size - config.margin * 2, size - config.margin * 2)

		text = @name + ' (' + @level + ')'

		context.font = config.nameFontSize + 'px Roboto'
		context.lineWidth = 1
		context.fillStyle = '#FFFFFF'
		context.strokeStyle = '#000000'
		measure = context.measureText(text)
		context.fillText(text, (size - measure.width) / 2, config.nameFontSize)
		context.strokeText(text, (size - measure.width) / 2, config.nameFontSize)


		context.font = config.barFontSize + 'px Roboto'
		context.strokeStyle = 'rgba(0, 0, 0, 0.7)'
		context.fillStyle = 'rgba(0, 0, 0, 0.4)'
		context.fillRect(config.margin, size - config.barFontSize - config.margin, size - config.margin * 2, config.barFontSize)
		context.strokeRect(config.margin, size - config.barFontSize - config.margin, size - config.margin * 2, config.barFontSize)

		context.fillStyle = 'rgba(217, 83, 79, 1)'
		context.fillRect(config.margin, size - config.barFontSize - config.margin, (size - config.margin * 2) * (@health / @maxHealth), config.barFontSize)

		text = Math.round(@health) + ' / ' + @maxHealth
		measure = context.measureText(text)
		context.fillStyle = '#000000'
		context.fillText(text, (size - measure.width) / 2, size - config.barFontSize / 2)





class Battle

	speed: 
		view: 3.0
		info: 3.0
		next: 3.0




	construct: ->



	load: ->

		if battleLog?
			@canvas = $('#battleView')[0]
			@context = @canvas.getContext('2d')
			@index = 0
			@characters = []
			@state = 'view'
			@offset = 0
			@pause = false

			$(@canvas).click((event) => @click(event))
			$(document).keydown((event) => @key(event))

			for data in battleLog['teams']['red']
				character = new Character('red', data)
				@characters[character.id] = character


			for data in battleLog['teams']['blue']
				character = new Character('blue', data)
				@characters[character.id] = character

			@context.font = config.fontSize + 'px Roboto'


			@action = battleLog['log'][@index]
			@attacker = @characters[@action.attacker]
			@defender = @characters[@action.defender]

			true
		else
			false

	drawCharacters: (attacker, defender) ->

		size = @canvas.height * 0.6
		halfWidth = @canvas.width / 2

		@context.save()
		@context.translate((halfWidth - size) / 2, (@canvas.height - size) / 2)
		attacker.draw(@context, size)
		@context.restore()

		@context.save()
		@context.translate((halfWidth - size) / 2 + halfWidth, (@canvas.height - size) / 2)
		defender.draw(@context, size)
		@context.restore()


	drawInfo: (text) ->
		halfWidth = @canvas.width / 2
		halfHeight = @canvas.height / 2
		blockSize = @canvas.height * 0.6

		starRadius = 50
		starWidth = starRadius * 2
		starX = halfWidth + (blockSize + starRadius) / 2
		starY = halfHeight
		starW = (blockSize * 0.7) / starWidth
		starH = 1.2
		starPikes = 13

		@context.font = config.fontSize + 'px Roboto'
		measure = @context.measureText(text)
		textX = starX - measure.width / 2
		textY = halfHeight



		@context.save()
		@context.lineWidth = 2
		@context.translate(starX, starY)
		@context.scale(starW, starH)
		@context.fillStyle = '#FFFFFF'
		@context.strokeStyle = '#000000'
		@drawStar(starPikes, starRadius * 0.6, starRadius)
		@context.restore()

		@context.save()
		@context.translate(textX, textY)
		@context.fillStyle = '#000000'
		@context.fillText(text, 0, 0)
		@context.restore()


	drawStar: (pikes, innerRadius, outerRadius) ->
		rot = Math.PI / 2 * 3
		step = Math.PI / pikes

		@context.beginPath()
		x = Math.cos(rot) * outerRadius
		y = Math.sin(rot) * outerRadius
		@context.moveTo(x, y)
		rot += step

		for i in [1..pikes]
			x = Math.cos(rot) * innerRadius
			y = Math.sin(rot) * innerRadius
			@context.lineTo(x, y)
			rot += step

			x = Math.cos(rot) * outerRadius
			y = Math.sin(rot) * outerRadius
			@context.lineTo(x, y)
			rot += step

		@context.lineTo(0, -outerRadius)
		@context.fill()
		@context.stroke()
		@context.closePath()
		




	draw: (delta)->

		@context.fillStyle = '#FFFFFF'
		@context.clearRect(0, 0, @canvas.width, @canvas.height)
		@offset += @speed[@state] * delta
		animate = true

		if @state == 'view' and animate
			action = battleLog['log'][@index]
			attacker = @characters[action.attacker]
			defender = @characters[action.defender]

			if(action.type == 'hit')
				defender.health = action.health

			@drawCharacters(attacker, defender)

			if(@offset > 1.0 and not @pause)
				@offset = 0.0
				defender.startHealth = defender.health

				if action.type == 'hit'
					defender.endHealth = Math.max(defender.health - action.damage, 0)
				else
					defender.endHealth = defender.health

				@state = 'info'

			animate = false

		if @state == 'info' and animate
			action = battleLog['log'][@index]
			attacker = @characters[action.attacker]
			defender = @characters[action.defender]

			@drawCharacters(attacker, defender)

			if @offset <= 1.0
				@context.globalAlpha = @offset
				defender.health = defender.startHealth
			else
				if @offset <= 2.0
					@context.globalAlpha = 1.0

					i = Math.clamp(@offset - 1.0, 0, 1)
					defender.health = Math.lerp(i, defender.endHealth, defender.startHealth)

				else
					defender.health = defender.endHealth
					@context.globalAlpha = Math.max(3.0 - @offset, 0)

			if(@offset > 4.0)
				@offset = 0.0
				@state = 'next'

			if action.type == 'hit'
				text = action.damage

				if action.crit
					text += '!'

			else
				text = 'dodge'



			@drawInfo(text)


			@context.globalAlpha = 1.0
			animate = false

		if @state == 'next' and animate

			prevAction = battleLog['log'][@index]
			nextAction = battleLog['log'][@index + 1]


			prevAttacker = @characters[prevAction.attacker]
			prevDefender = @characters[prevAction.defender]


			position = (@canvas.height / 2) * @offset

			@context.save()
			@context.translate(0, -position)
			@drawCharacters(prevAttacker, prevDefender)
			@context.restore()


			@context.save()
			@context.translate(0, @canvas.height - position)

			if nextAction?
				nextAttacker = @characters[nextAction.attacker]
				nextDefender = @characters[nextAction.defender]

				if(nextAction.type == 'hit')
					nextDefender.health = nextAction.health

				@drawCharacters(nextAttacker, nextDefender)

			else
				text = 'End'
				@context.fillStyle = '#000000'
				measure = @context.measureText(text)
				@context.fillText(text, (@canvas.width - measure.width) / 2, (@canvas.height - 15) / 2)

			@context.restore()

			if @offset > 2.0
				@index++
				@offset = 0.0
				if nextAction?
					@state = 'view'
				else
					@state = 'end'

			animate = false


		if @state == 'end' and animate
			text = 'End'
			@offset = 0.0
			@context.fillStyle = '#000000'
			measure = @context.measureText(text)
			@context.fillText(text, (@canvas.width - measure.width) / 2, (@canvas.height - 15) / 2)
			animate = false




		width = @canvas.width - 4
		height = @canvas.height - 2

		@context.save()
		@context.strokeStyle = 'rgba(0, 0, 0, 0.7)'
		@context.fillStyle = 'rgba(0, 0, 0, 0.4)'
		@context.fillRect(2, height - 20, width, 20)
		@context.strokeRect(2, height - 20, width, 20)

		@context.fillStyle = '#5BC0DE'
		@context.fillRect(2, height - 20, width * (Math.min(@index / (battleLog['log'].length - 1), 1)), 20)
		@context.lineWidth = 5

		for mark in battleLog['marks']

			if mark.type == 'fainted'
				@context.strokeStyle = '#D9534F'

			at = (mark.at / (battleLog['log'].length - 1)) * width

			@context.beginPath()
			@context.moveTo(at - @context.lineWidth / 2 + 2, height - 20)
			@context.lineTo(at - @context.lineWidth / 2 + 2, height)
			@context.stroke()

		@context.restore()




	click: (event) ->
		coords = @canvas.relMouseCoords(event)
		x = coords.x
		y = coords.y

		l = 2
		r = l + @canvas.width - 4
		b = @canvas.height - 2
		t = b - 20


		if x >= l and x <= r and y >= t and y <= b
			@index = Math.round((x - l) / (r - l) * (battleLog['log'].length - 1))
			@state = 'view'
			@offset = 0.0

	key: (event) ->

		if event.which == 32
			@pause = !@pause


		if event.which == 37
			@index = Math.max(@index - 1, 0)
			@offset = 1.0
			@state = 'view'

		if event.which == 39
			@index = Math.min(@index + 1, battleLog['log'].length - 1)
			@offset = 1.0
			@state = 'view'









battle = new Battle;

lastTime = new Date().getTime()
interval = 1000 / 60
accumulator = 0.0


requestFrame = (time)->

	delta = Math.max(time - lastTime, 0)
	lastTime = time 
	accumulator += delta

	while accumulator >= interval
		accumulator -= interval
		battle.draw(interval / 1000)

	window.requestAnimationFrame(requestFrame)








$ ->
	if battle.load()
		window.requestAnimationFrame(requestFrame)