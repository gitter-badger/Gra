



$ -> 
	$('.image-preview').each ->
		preview = this
		id = $(this).data('for')
		$('#' + id).change((event) -> 

			path = URL.createObjectURL(event.target.files[0])
			$(preview).attr 'src', path if path?

			
		).trigger 'change'
