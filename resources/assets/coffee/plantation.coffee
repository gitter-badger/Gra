

imageForFrame = (frame) ->
	'/images/plants/plant-' + frame + '.png'

refreshPlant = (plant) -> 
	now = Math.round((new Date).getTime() / 1000)
	start = parseInt $(plant).data 'start'
	end = parseInt $(plant).data 'end'
	watering = parseInt $(plant).data 'watering'
	now = Math.min now, watering
	frame = Math.floor(17 * Math.clamp((now - start) / (end - start), 0, 1)) 
	$(plant).attr 'src', imageForFrame frame

	setTimeout (-> refreshPlant plant), 1000 if frame < 17

$ ->
	$('.plantation-plant').each -> refreshPlant this

	$('#seedsModal').on 'show.bs.modal', (event) ->
		slot = $(event.relatedTarget).data 'slot'
		$(this).find('input[name=slot]').val slot