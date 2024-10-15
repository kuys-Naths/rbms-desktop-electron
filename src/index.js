$(document).ready(function () {
    if (localStorage.getItem('alertShown') !== 'true') {
        // Show the alert
        document.getElementById('updateAlert').style.display = 'block';
        
        // Set the local storage to prevent the alert from showing again
        localStorage.setItem('alertShown', true);
    } else {
        // Hide the alert
        document.getElementById('updateAlert').style.display = 'none';
    }
    $(window).scrollTop(0);

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

        const $hamburger = $('.hamburger');
        const $logout = $('.collapse-menu');
        const $logoutButton = $logout.find('#logout');

        $hamburger.on('click', function () {
            $logout.toggleClass('active');
        });

        $logoutButton.on('click', function () {
            localStorage.removeItem('sessionUser');
            localStorage.setItem('isLoggedIn', 'false');
            location.reload(); // replace 'your_key_here' with the actual key you want to delete
            // you can also use sessionStorage.removeItem() if you want to delete a key from session storage
        });

        // Close menu when clicking outside
        $(document).on('click', function (event) {
            $(document).on('click', function (event) {
                if (
                    !$hamburger.is(event.target) &&
                    $hamburger.has(event.target).length === 0 &&
                    $hamburger.hasClass('active')
                ) {
                    $hamburger.removeClass('active');
                    $logout.removeClass('active');
                }
            });
        });

        $('.card').on('click', function () {
            var linkId = $(this).data('link-id');
            $('.nav-link').removeClass('active');
            $('#' + linkId).addClass('active');

            if (linkId === 'Revenue') {
                $('#statistics').text('Revenue');
                $('#statistics').addClass('active'); // Add this line
            } else {
                $('#statistics').text('Statistics');
                $('#statistics').removeClass('active'); // Add this line
            }
        });
    });

    $('.bottom-cards .card').on('click', function () {
        // Get the card that was clicked
        var card = $(this);

        // Get the card type (e.g. revCard, accCard, etc.)
        var cardType = card.attr('class').split(' ')[1];

        // Handle the click event based on the card type
        switch (cardType) {
            case 'revCard':
                // Handle revCard click event
                console.log('Rev card clicked!');
                $('html, body').scrollTop($(document).find('#RevenuePage').offset().top);
                break;
            case 'accCard':
                // Handle accCard click event
                console.log('Acc card clicked!');
                $('html, body').scrollTop($(document).find('#AccountsPage').offset().top);
                break;
            case 'mapCard':
                // Handle mapCard click event
                console.log('Map card clicked!');
                $('html, body').scrollTop($(document).find('#GPSTrackingPage').offset().top);
                break;
            case 'bikeCard':
                // Handle bikeCard click event
                console.log('Bike card clicked!');
                $('html, body').scrollTop($(document).find('#BikeAvailabilityPage').offset().top);
                break;
            default:
                console.log('Unknown card type clicked!');
        }
    });

    //bikeUpload
    const $formFile = $('#formFile');
    const $cardImg = $('.card-img img');

    $formFile.on('change', function (e) {
        const file = e.target.files[0];
        $formFile.val(''); // Clear the input
        $cardImg.attr('src', '');
        // Check if the selected file is an image
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const imageData = event.target.result;
                $cardImg.attr('src', imageData);
            };

            reader.readAsDataURL(file);
        } else {
            // Show an alert or a message to the user
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
                icon: 'error',
                text: 'Please select valid image file.',
            });
            $formFile.val(''); // Clear the input
            $cardImg.attr('src', ''); // Clear the previous image
        }
    });

    //inputPrice
    $('#rp').on('input', function () {
        let val = this.value.replace(/[^0-9]/g, ''); // remove non-numeric characters
        val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // add commas as thousand separators
        this.value = val;
    });
    function makeBikeID(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    const BikeID = 'RBMS-' + makeBikeID(4);
    $('#bikeNum').val(BikeID);

    //EditAccountInfo
    const $passwordInput = $('#A_New_Password');
    const $showPasswordButton = $('#show-npass');

    // Add an event listener to the show password button
    $showPasswordButton.on('click', function () {
        // Toggle the password input type
        $passwordInput.attr('type', $passwordInput.attr('type') === 'password' ? 'text' : 'password');
        // Toggle the button text
        $(this).html(
            $(this).html() === '<i class="fa fa-eye"></i>'
                ? '<i class="fa fa-eye-slash"></i>'
                : '<i class="fa fa-eye"></i>',
        );
    });
    const $cpasswordInput = $('#A_cNew_Password');
    const $showcPasswordButton = $('#show-cnpass');

    // Add an event listener to the show password button
    $showcPasswordButton.on('click', function () {
        // Toggle the password input type
        $cpasswordInput.attr('type', $cpasswordInput.attr('type') === 'password' ? 'text' : 'password');
        // Toggle the button text
        $(this).html(
            $(this).html() === '<i class="fa fa-eye"></i>'
                ? '<i class="fa fa-eye-slash"></i>'
                : '<i class="fa fa-eye"></i>',
        );
    });

    const userId = localStorage.getItem('myId');
    loadUser(userId);
    $('#btnEdit').on('click', function () {
        $('input').prop('readonly', function (index, value) {
            return !value;
        });

        $('#btnSave').prop('disabled', function(i, val) {
            return !val; // Toggle the disabled state
        });
    });

    $('#btnReset').on('click', () => {
        loadUser(userId);
    });
    function loadUser(id) {
        try {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8917/findById/' + id, // replace with your endpoint URL
                dataType: 'json',
                success: function (data) {
                    // console.log(data); // user data
                    $('#A_Username').val(data.S_Username);
                    $('#A_Email').val(data.S_Email);
                    $('#A_Name').val(data.S_Name);
                    $('#A_Address').val(data.S_Address);
                    $('#A_CNum').val(data.S_ContactNum);
                },
                error: function (xhr, status, error) {
                    console.log(error); // error message
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    $('#btnSave').on('click', function () {
        const AName = $('#A_Name').val();
        const AAddress = $('#A_Address').val();
        const ACNum = $('#A_CNum').val();
        const AEmail = $('#A_Email').val();
        const APassword = $('#A_New_Password').val();

        const newUser = {
            S_Name: AName,
            S_Address: AAddress,
            S_ContactNum: ACNum,
            S_Email: AEmail,
        }
        
        $.ajax({
            type: "PUT",
            url: "http://localhost:8917/updateUser/" + userId,
            data: JSON.stringify(newUser),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                $('#A_Username').val(data.S_Username);
                $('#A_Email').val(data.S_Email);
                $('#A_Name').val(data.S_Name);
                $('#A_Address').val(data.S_Address);
                $('#A_CNum').val(data.S_ContactNum);

                Swal.fire({
                    toast: true,
                    text: 'Updated Successfully',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    position: 'top-end',
                    didClose: () => {
                        localStorage.setItem('sessionUser', data.S_Name);
                        location.reload();
                    }
                })
            },
            error: function (error) {
                console.log(error); // error message
            }


        })
    });
    
});
