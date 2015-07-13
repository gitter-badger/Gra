<!DOCTYPE HTML>
<!DOCTYPE html>
<html>
<head>
	<title>Account verification</title>

	<style type="text/css" media="screen">
		
		h2, p {
			width: 100%;
		}

		h2 {
			text-align: center;
		}

		small {
			color: darkgray;
			font-size: 75%;
		}

	</style>
</head>
<body>
	<h2>Account verification</h2>
	<p>To complete the registration process click <a href="{{ route('user.verify', ['token' => $token]) }}">here</a></p>
	<p>If this is not you who made the registration, please ignore this mail</p>

	<p><small>Registration ip: {{ $ip }}</small></p>
	<p><small>Registration date: {{ $date }}</small></p>
</body>
</html>
