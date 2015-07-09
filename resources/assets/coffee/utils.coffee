window.format or= 
	time:
		day: 'd'
		hour: 'h'
		minute: 'm'
		second: 's'




window.active ?= false



$(window).focus ->
	window.active = true

$(window).blur ->
	window.active = false





window.lpad or= (value, padding) ->
  zeroes = "0"
  zeroes += "0" for i in [1..padding]

  (zeroes + value).slice(padding * -1)


timeSeparate = (value) ->
	if value.length > 0
		value + ' '
	else
		value

timeFormat = (text, value, format) ->
	text = timeSeparate(text)

	if text.length > 0
		text += window.lpad value, 2
	else 
		text += value

	text + format


window.timeFormat or= (value) ->
	text = ''
	date = new Date(value * 1000)
	d = date.getUTCDate() - 1
	h = date.getUTCHours()
	m = date.getUTCMinutes()
	s = date.getUTCSeconds()

	text += d + format.time.day if d > 0
	text = timeFormat(text, h, format.time.hour) if h > 0
	text = timeFormat(text, m, format.time.minute) if h > 0 or m > 0
	text = timeFormat(text, s, format.time.second) if h > 0 or m > 0 or s > 0

	text


window.location.refresh or= ->
	loc = window.location
	window.location = loc.protocol + '//' + loc.host + loc.pathname + loc.search




notifications = []
window.notify or= (props)->
	notifications.push props


clone = (obj) ->
	return obj  if obj is null or typeof (obj) isnt "object"
	temp = new obj.constructor()
	for key of obj
		temp[key] = clone(obj[key])
	temp

showNotify = (n, i) ->
	console.log('P', n, i);
	setTimeout (-> 
		console.log('S', n, i);
		$.notify(n, {

			placement: {

				from: 'bottom',
			},
			mouse_over: 'pause',

			})), i * 1000
	



window.notifyShow or= ->
	if window.active

		for notification, index in notifications
			showNotify $.extend({}, notification), index
		notifications = []



$(window).focus -> window.notifyShow()











Math.clamp or= (value, min, max) ->
	Math.max(Math.min(value, max), min)










updateProgress = ->
	bar = $(this).children('.progress-bar')
	label = $(this).children('.progress-label')

	min = $(bar).data('min')
	max = $(bar).data('max')
	now = Math.clamp($(bar).data('now'), min, max)
	reversed = Boolean($(bar).data('reversed') ? false)

	percent = (now - min) / (max - min) * 100
	percent = 100 - percent if reversed


	$(bar).css 'width', percent + '%'
	$(label).text(now + ' / ' + max)

$ -> 
	$('.progress').each ->
		this.update or= updateProgress
