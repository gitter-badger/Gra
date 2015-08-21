
$ ->

	tutorials = {}
	$('.tutorial-step').popover({trigger: 'manual', placement: 'bottom'})

	show = (step) ->

		if step?

			$(step.elements)
				.bind('click', clicked)
				.addClass('tutorial-active')
				.first()
				.popover('show')


	clicked = () ->

		next = tutorials[this.step.name].shift()

		if next?

			$.ajax({

				url: '/api/character/tutorial',
				dataType: 'json',
				data: {name: this.step.name, stage: next.index},
				method: 'POST',	
			})

			setTimeout(->

				show(next)
			, 500)
		else
			$.ajax({

				url: '/api/character/tutorial',
				dataType: 'json',
				data: {name: this.step.name, stage: this.step.index + 1},
				method: 'POST',	
			})
		



		$(this.step.elements).unbind('click', clicked)
			.removeClass('tutorial-active')
			.popover('hide')


	receive = (object, name, data) ->

		if data.stage < 0


			modal = $('<div></div>').addClass('modal fade')
			dialog = $('<div></div>').addClass('modal-dialog')
			content = $('<div></div>').addClass('modal-content')
			header = $('<div></div>').addClass('modal-header')
			body = $('<div></div>').addClass('modal-body')
			footer = $('<div></div>').addClass('modal-footer')
			title = $('<h4></h4>').addClass('modal-title')

			group = $('<div></div>').addClass('btn-group')
			btn1 = $('<div></div>').addClass('btn btn-success').attr('value', 'yes').text('yes')
			btn2 = $('<div></div>').addClass('btn btn-danger').attr('value', 'no').text('no')

			$(btn1).click(->

				$.ajax({

					url: '/api/character/tutorial',
					dataType: 'json',
					data: {name: name, active: 1},
					method: 'POST',	
				})

				$(modal).modal('hide')

				load(object, name, data)
			)

			$(btn2).click(->

				$.ajax({

					url: '/api/character/tutorial',
					dataType: 'json',
					data: {name: name, active: 0},
					method: 'POST',	
				})

				$(modal).modal('hide')

			)

			$(title)
				.text(data.title)

			$(body)
				.text(data.description)

			$(header)
				.append(title)


			$(group)
				.append(btn2)
				.append(btn1)

			$(footer)
				.append(group)


			$(content)
				.append(header)
				.append(body)
				.append(footer)

			$(dialog)
				.append(content)

			$(modal)
				.append(dialog)

			$('body')
				.append(modal)

			$(modal).modal({backdrop: 'static', show: true, keyboard: false})


		else
			load(object, name, data)



	load = (object, name, data) ->

		tutorial = []

		$(object).find('.tutorial-step').each(->

			step = null
			index = $(this).data('tutorial-index')

			return if index < data.stage



			if tutorial[index]?
				step = tutorial[index]
			else
				step = {

					elements: [],
					name: name,
					index: index,
				}
				tutorial[index] = step


			step.elements.push(this)
			this.step = step
		)

		tutorial = tutorial.filter((element) ->

			if element?
				return true
			else
				return false
		)



		tutorials[name] = tutorial
		show(tutorial.shift())





	$('[data-tutorial=true').each(->

		name = $(this).data('tutorial-name')

		$.ajax({

			url: '/api/character/tutorial',
			dataType: 'json',
			data: {name: name},
			method: 'GET',
			success: (data) =>
				receive(this, name, data) if data.active
		})
	)