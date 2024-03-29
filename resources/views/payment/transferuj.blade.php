
@foreach(Config::get('payments.transferuj.' . Config::get('app.locale') . '.products', []) as $index => $product)

<div class="col-xs-12 col-sm-6 col-md-4">
	<div class="panel panel-default">
		<div class="panel-heading">
		
			<h4>@lang('payment.transferuj.product.' . $index)</h4>
		</div>

		<div class="panel-body equalize">
			
			<p><strong>@lang('payments.transferuj.price'):</strong> {{ $product['price'] }} {{ Config::get('payments.transferuj.' . Config::get('app.locale') . '.currency') }}</p>
			<p><strong>@lang('payments.transferuj.amount'):</strong> {{ $product['amount'] }}</p>
				
			<form action="https://secure.transferuj.pl" method="post" accept-charset="utf-8">

				<input type="hidden" name="id" value="{{ Config::get('payments.transferuj.vendor-id') }}">
				<input type="hidden" name="kwota" value="{{ $product['price'] }}">
				<input type="hidden" name="opis" value="{{ $product['description'] }}">


				<input type="hidden" name="crc" value="{{ Config::get('payments.transferuj.crc') }}">
				<input type="hidden" name="wyn_url" value="{{ Config::get('payments.transferuj.notify-url') }}">
				<input type="hidden" name="wyn_email" value="{{ Config::get('payments.transferuj.notify-email') }}">
				<input type="hidden" name="opis_sprzed" value="{{ Config::get('payments.transferuj.vendor-description') }}">
				<input type="hidden" name="pow_url" value="{{ Config::get('payments.transferuj.return-success') }}">
				<input type="hidden" name="pow_url_blad" value="{{ Config::get('payments.transferuj.return-fail') }}">

				<input type="hidden" name="email" value="{{ Config::get('payments.transferuj.email') }}">
				<input type="hidden" name="nazwisko" value="{{ Config::get('payments.transferuj.last-name') }}">
				<input type="hidden" name="imie" value="{{ Config::get('payments.transferuj.first-name') }}">
				<input type="hidden" name="adres" value="{{ Config::get('payments.transferuj.address') }}">
				<input type="hidden" name="miasto" value="{{ Config::get('payments.transferuj.city') }}">
				<input type="hidden" name="kod" value="{{ Config::get('payments.transferuj.postal-code') }}">
				<input type="hidden" name="kraj" value="{{ Config::get('payments.transferuj.country') }}">
				<input type="hidden" name="telefon" value="{{ Config::get('payments.transferuj.phone') }}">
				<input type="hidden" name="jezyk" value="{{ Config::get('app.locale') }}">

				<input type="hidden" name="md5sum" value="{{ md5(Config::get('payments.transferuj.vendor-id') . $product['price'] . 
					Config::get('payments.transferuj.crc') . Config::get('payments.transferuj.vendor-code')) }}">
				

				<input type="submit" name="Przejdź do płatności">
			</form>
		</div>
	</div>
</div>


@endforeach