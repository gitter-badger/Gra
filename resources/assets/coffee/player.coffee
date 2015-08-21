url = '/api/character';


setProgress = (object, value, minValue, maxValue, lastUpdate, nextUpdate) ->

	bar = $('.' + object + '-bar')
	timer = $('.' + object + '-timer')


	if bar.length > 0
		child = $(bar).children '.progress-bar'

		$(child)
			.data 'max', maxValue
			.data 'min', minValue
			.data 'now', value
		bar[0].update?()


	if timer.length > 0
		child = $(timer).children '.progress-bar'

		if nextUpdate?
			$(child)
				.data 'max', nextUpdate
				.data 'min', lastUpdate
		else
			$(child)
				.data 'max', 1
				.data 'min', 0


setValues = (object, value, minValue, maxValue) ->
	$('.' + object + '-now')
		.text value

	$('.' + object + '-min')
		.text minValue

	$('.' + object + '-max')
		.text maxValue

setValue = (object, value) ->
	$('.' + object)
		.text value




fill = (data) ->
	setProgress 'health', data.health, 0, data.maxHealth, data.healthUpdate, data.nextHealthUpdate
	setValues 'health', data.health, 0, data.maxHealth

	setProgress 'energy', data.energy, 0, data.maxEnergy, data.energyUpdate, data.nextEnergyUpdate
	setValues 'energy', data.energy, 0, data.maxEnergy

	setProgress 'wanted', data.wanted, 0, 6, data.wantedUpdate, data.nextWantedUpdate
	setValues 'wanted', data.wanted, 0, 6

	setProgress 'experience', data.experience, 0, data.maxExperience, null, null
	setValues 'experience', data.experience, 0, data.maxExperience


	setProgress 'plantator', data.plantatorExperience, 0, data.plantatorMaxExperience, null, null
	setValues 'plantator', data.plantatorExperience, 0, data.plantatorMaxExperience

	setProgress 'smuggler', data.smugglerExperience, 0, data.smugglerMaxExperience, null, null
	setValues 'smuggler', data.smugglerExperience, 0, data.smugglerMaxExperience

	setProgress 'dealer', data.dealerExperience, 0, data.dealerMaxExperience, null, null
	setValues 'dealer', data.dealerExperience, 0, data.dealerMaxExperience





	#setValue 'level', data.level
	#setValue 'plantator-level', data.plantatorLevel
	#setValue 'smuggler-level', data.smugglerLevel
	#setValue 'dealer-level', data.dealerLevel
	#setValue 'strength', data.strength,
	#setValue 'perception', data.perception
	#setValue 'endurance', data.endurance
	#setValue 'charisma', data.charisma
	#setValue 'intelligence', data.intelligence
	#setValue 'agility', data.agility
	#setValue 'luck', data.luck + '%'
	#setValue 'statisticPoints', data.statisticPoints
	#setValue 'talentPoints', data.talentPoints
	#setValue 'money', '$' + data.money
	#setValue 'reports', data.reportsCount
	#setValue 'messages', data.messagesCount

	scope = angular.element(document.body).scope()

	if scope? and scope.player?
		#scope.player.level = data.level
		#scope.player.plantatorLevel = data.plantatorLevel
		#scope.player.smugglerLevel = data.smugglerLevel
		#scope.player.dealerLevel = data.dealerLevel
		#scope.player.strength = data.strength
		#scope.player.perception = data.perception
		#scope.player.endurance = data.endurance
		#scope.player.charisma = data.charisma
		#scope.player.intelligence = data.intelligence
		#scope.player.agility = data.agility
		#scope.player.luck = data.luck
		#scope.player.respect = data.respect
		#scope.player.weight = data.weight
		#scope.player.capacity = data.capacity
		#scope.player.minDamage = data.minDamage
		#scope.player.maxDamage = data.maxDamage
		#scope.player.defense = data.defense
		#scope.player.critChance = data.critChance
		#scope.player.speed = data.speed
		#scope.player.experienceModifier = data.experienceModifier
		#scope.player.moneyModifier = data.moneyModifier

		for k, v of data
			scope.player[k] = v

		scope.$apply()




loaded = (data) ->

	fill data

	if data.reload

		window.location.refresh()
	else
		if window.active
			$.ajax {

				url: url + '/notifications',
				dataType: 'json',
				method: 'GET',
				success: notify
			}

			$.ajax {

				url: url + '/messages',
				dataType: 'json',
				method: 'GET',
				success: message,
			}

	setTimeout load, data.nextUpdate * 1000


notify = (data) ->
	for n in data
		window.notify {

			title: '<strong>' + n.title + '</strong>',
			message: '',
			url: '/reports/' + n.id,

		}

	if window.active
		window.notifyShow()

message = (data) ->
	for n in data
		window.notify {

			title: '<strong>' + n.author + '</strong>: ' + n.title + '<br/>',
			message: n.content,
			url: '/messages/inbox/' + n.id,

		}

	if window.active
		window.notifyShow()



load = ->

	$.ajax {

		url: url,
		dataType: 'json',
		method: 'GET',
		success: loaded
	}



	
$(window).focus ->
	load()


$ ->
	load()