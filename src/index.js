$(document).ready(function () {
    $(window).scrollTop(0);
    // Load Navbar HTML

    var originalText = $('#statistics').text();

    $('.nav-link').on('click', function () {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        if ($(this).attr('id') !== 'statistics') {
            $('#statistics').text(originalText);
        }

        if ($(this).attr('id') !== 'statistics') {
            $('#statistics').text(originalText);
        }
    });
    $('.dropdown-menu a').on('click', function () {
        var newText = $(this).text();
        $('#statistics').text(newText);
    });

    $('.HeaderNavContainer').load('./components/HeaderNav/HeaderNav.html', function () {
        $('.hamburger').on('click', function () {
            $(this).add('.nav-links').toggleClass('active');
        });
    });

    $('.bottom-cards .card').on('click', function() {
        // Get the card that was clicked
        var card = $(this);
      
        // Get the card type (e.g. revCard, accCard, etc.)
        var cardType = card.attr('class').split(' ')[1];
      
        // Handle the click event based on the card type
        switch (cardType) {
          case 'revCard':
            // Handle revCard click event
            console.log('Rev card clicked!');
            $('html, body').scrollTop($(document).find('#RevenuePage').offset().top)
            break;
          case 'accCard':
            // Handle accCard click event
            console.log('Acc card clicked!');
            $('html, body').scrollTop($(document).find('#AccountsPage').offset().top)
            break;
          case 'mapCard':
            // Handle mapCard click event
            console.log('Map card clicked!');
            $('html, body').scrollTop($(document).find('#GPSTrackingPage').offset().top)
            break;
          case 'bikeCard':
            // Handle bikeCard click event
            console.log('Bike card clicked!');
            $('html, body').scrollTop($(document).find('#BikeAvailabilityPage').offset().top)
            break;
          default:
            console.log('Unknown card type clicked!');
        }
      });
});
