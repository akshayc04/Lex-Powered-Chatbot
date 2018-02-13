
console.log('selected hotel:');
var hotelID = localStorage.getItem('hotelID');
var hotel = JSON.parse(localStorage.getItem('selectedHotel'));
console.log(hotel);

$(document).prop('title', hotel.name + ' - ' + hotel.location);

$('.hotel-title').text(hotel.name + ' - ' + hotel.location);
$('#hotel-image').attr('src', 'public/img/hotel_' + (parseInt(hotelID) + 1) + '.jpg');
$('.slider-subtitle').text(hotel.address);

$('#menuModal .modal-body').html('<img src="public/img/menu_' + (parseInt(hotelID) + 1) + '.jpg">');
$('#menuModal .modal-title').text('Menu - ' + hotel.name);


$('.slider-description').html('<ul>\n' +
    '\t\t\t\t\t\t\t<li><b>Phone: </b>' + hotel.phone + '</li>\n' +
    '\t\t\t\t\t\t\t<li><b>Cancellation Policy: </b>' + hotel.cancellationPolicy + '</li>\n' +
    '\t\t\t\t\t\t\t<li><b>Restaurant Menu: </b>' + '<button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#menuModal">See Menu</button>' + '</li>\n' +
    '\t\t\t\t\t\t</ul>');

