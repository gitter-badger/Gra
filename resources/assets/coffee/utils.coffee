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

$(window).resize ->
	clearTimeout(this.resizeTo) if this.resizeTo
	this.resizeTo = setTimeout(->
		$(this).trigger('resized')
	, 500)
	



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

refreshing = false


window.location.refresh or= ->
	if not refreshing
		refreshing = true
		window.location.reload(true)




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


Math.lerp or= (i, a, b) ->
	(a * i) + (b * (1 - i))



Math.hexToRgb or= (hex) -> 
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)

    } if result;
    null;

Math.rgbToHex or= (r, g, b) ->
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);


Math.lerpColors or= (i, a, b) ->

	ca = Math.hexToRgb a
	cb = Math.hexToRgb b

	cc = {
		r: Math.round(Math.lerp(i, ca.r, cb.r)),
		g: Math.round(Math.lerp(i, ca.g, cb.g)),
		b: Math.round(Math.lerp(i, ca.b, cb.b)),
	}

	return Math.rgbToHex(cc.r, cc.g, cc.b)





updateProgress = ->
	bar = $(this).children('.progress-bar')
	label = $(this).children('.progress-label')

	min = $(bar).data('min')
	max = $(bar).data('max')
	ca = $(bar).data('ca')
	cb = $(bar).data('cb')
	now = Math.clamp($(bar).data('now'), min, max)
	reversed = Boolean($(bar).data('reversed') ? false)

	percent = (now - min) / (max - min) * 100
	percent = 100 - percent if reversed





	$(bar).css('width', percent + '%')
	$(bar).css('background-color', Math.lerpColors(percent / 100, ca, cb)) if ca? and cb?



	$(label).text(now + ' / ' + max)

$ -> 
	$('.progress').each ->
		this.update or= updateProgress



relMouseCoords = `function (event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}`

HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;