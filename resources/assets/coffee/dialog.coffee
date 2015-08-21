

dialogs = []


show = (dialog) ->

	dismissible = ($(dialog).data('dismissible')) ? true
	console.log(dismissible)


	if dismissible

		$(dialog).modal({backdrop: true, show: true, keyboard: true})

	else

		$(dialog).modal({backdrop: 'static', show: true, keyboard: false})


$ ->
	dialogs = $('.modal.autoshow')


	$(dialogs).each((index) ->

		if index == 0
			show(this)

		if index < (dialogs.length - 1)
			$(this).on('hidden.bs.modal', (event) ->

				show(dialogs[index + 1])
			)
	)