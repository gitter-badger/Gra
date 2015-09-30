@extends('app')


@section('content')


{!! BootForm::open() !!}


{!! BootForm::textarea('<strong>Zawartość</strong>', 'content')->value($output) !!}


{!! BootForm::close() !!}

<a href="{{ route('admin.item.index') }}" class="btn btn-default">{!! entity('icon')->icon('arrow-left') !!}</a>

@endsection