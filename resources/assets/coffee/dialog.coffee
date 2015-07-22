

dialogs = []



$ ->
	dialogs = $('.modal.autoshow')


	$(dialogs).each((index) ->

		if index == 0
			$(this).modal('show')

		if index < (dialogs.length - 1)
			$(this).on('hidden.bs.modal', (event) ->

				$(dialogs[index + 1]).modal('show')
			)
	)