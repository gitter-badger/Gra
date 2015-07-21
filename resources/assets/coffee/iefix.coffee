lastTime = 0
vendors = ['webkit', 'moz']

if not window.requestAnimationFrame
    for vendor in vendors
        window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame']
        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame']

window.requestAnimationFrame or= (callback, element) ->
    currTime = new Date().getTime()
    timeToCall = Math.max(0, 16 - (currTime - lastTime))

    id = window.setTimeout(->
        callback(currTime + timeToCall)
    , timeToCall)

    id

window.cancelAnimationFrame or= (id) ->
    clearTimeout(id)