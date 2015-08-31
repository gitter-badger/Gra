<!DOCTYPE HTML>
<html>
	<head>
		<title>@lang('email.verification.title')</title>


		@if(Config::get('app.cdn') && Config::get('app.bootstrapCdn'))


			<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
		@else

			@if(Config::get('app.minified'))


				<link href="{{ asset('/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css">
			@else

				<link href="{{ asset('/css/bootstrap.css') }}" rel="stylesheet" type="text/css">
			@endif


		@endif

		
		@if(Config::get('app.minified'))

			<link href="{{ asset('/css/theme.min.css') }}" rel="stylesheet" type="text/css">
		@else

			<link href="{{ asset('/css/theme.css') }}" rel="stylesheet" type="text/css">
		@endif

	</head>
	<body>

		@yield('content')
	</body>
</html>
