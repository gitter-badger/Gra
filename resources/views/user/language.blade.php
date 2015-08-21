@extends('user.base')


@section('tab-content')

{!! BootForm::open()->post() !!}

<?php 

$select = BootForm::select(trans('user.language'), 'language');


foreach(Config::get('app.languages') as $lang)
	$select->addOption($lang, trans('lang.' . $lang));

$select->defaultValue(App::getLocale());

echo $select;
?>

{!! BootForm::submit(trans('user.changeLanguage'), 'btn-primary')->addClass('center-block') !!}


{!! BootForm::close() !!}


@endsection