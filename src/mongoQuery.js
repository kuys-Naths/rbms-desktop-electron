$(document).ready(function () {
    $('#btnUp').on('click', function (event) {
        event.preventDefault();

        let bikeName = $('#NameOfBike').val();
        let bikeType = $('#bikeType').find(':selected').val();
        let bikeRPriceString = $('#rp').val().replace(/,/g, '');
        let bikeRPrice = parseInt(bikeRPriceString);
        let bikeNum = $('#bikeNum').val();
        let bikeDesc = $('#bikeDesc').val();
        let bikeImage = $('#formFile')[0].files[0];

        if (
            bikeName === '' ||
            bikeType === '' ||
            bikeRPrice === '' ||
            bikeNum === '' ||
            bikeDesc === '' ||
            bikeImage === null
        ) {
            Swal.fire({
                icon: 'error',
                toast: true,
                text: `please fill out all fields`,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        } else {
            const formData = new FormData();
            formData.append('file', bikeImage);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:8917/upload-image',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    const imageUrl = response.url;
                    const bikeInfo = {
                        B_Name: bikeName,
                        B_Type: bikeType,
                        B_RentingPrice: bikeRPrice,
                        B_BikeNumber: bikeNum,
                        B_Description: bikeDesc,
                        B_ImageUrl: imageUrl,
                    };

                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8917/uploadBike',
                        data: JSON.stringify(bikeInfo),
                        contentType: 'application/json',
                        success: function (response) {
                            console.log(response);
                            Swal.fire({
                                icon: 'success',
                                toast: true,
                                text: `Uploaded successfuly`,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer);
                                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                                    $('#bikeUploadForm').trigger('reset');
                                },
                            });
                        },
                        error: function (xhr, status, error) {
                            console.log(xhr, status, error);
                            Swal.fire({
                                icon: 'error',
                                toast: true,
                                text: `Error saving bike info!`,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer);
                                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                                },
                            });
                        },
                    });
                },
                error: function (xhr, status, error) {
                    console.log(xhr, status, error);
                    alert('Error uploading image!');
                },
            });
        }
    });
});
