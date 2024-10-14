const uploadFile = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: 'bikeImages',
            public_id: file.originalname,
        });
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};

$(document).ready(function () {
    $('#btnUp').on('click', function (event) {
        event.preventDefault();
        
        let bikeName = $('#NameOfBike').val();
        let bikeType = $('#bikeType').find(':selected').val();
        let bikeRPriceString = $('#rp').val().replace(/,/g, '');
        let bikeRPrice = parseInt(bikeRPriceString);
        let bikeNum = $('#bikeNum').val();
        let bikeDesc = $('#bikeDesc').val();
        let fileInput = $('#formFile')[0]; // Assuming you have a file input with id "fileInput"
        let file = fileInput.files[0];

        uploadFile(file).then((result) => {
            // Get the uploaded image URL from Cloudinary
            let imageUrl = result.secure_url;
      
            // Create a new bike document in MongoDB
            let bikeInfo = {
              B_Name: bikeName,
              B_Type: bikeType,
              B_RentingPrice: bikeRPrice,
              B_BikeNumber: bikeNum,
              B_Description: bikeDesc,
              B_ImageUrl: imageUrl
            };
      
            // Send the bike info to your MongoDB API
            $.ajax({
              type: 'POST',
              url: '/api/bikes', // Replace with your MongoDB API endpoint
              data: JSON.stringify(bikeInfo),
              contentType: 'application/json',
              dataType: 'json',
              success: function (data) {
                console.log('Bike uploaded successfully!');
              },
              error: function (xhr, status, error) {
                console.error(xhr, status, error);
              }
            });
          }).catch((error) => {
            console.error(error);
          });

        // // console.log(bikeInfo);
        // $.ajax({
        //     type: 'POST',
        //     url: 'http://localhost:8917/uploadBike',
        //     data: JSON.stringify(bikeInfo),
        //     contentType: 'application/json',
        //     dataType: 'json',
        //     success: function (data) {
        //         Swal.fire({
        //             toast: true,
        //             text: `Uploaded successfuly`,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 3000,
        //             timerProgressBar: true,
        //             didOpen: (toast) => {
        //                 toast.addEventListener('mouseenter', Swal.stopTimer);
        //                 toast.addEventListener('mouseleave', Swal.resumeTimer);
        //             },
        //         });
        //     },
        //     error: function (xhr, status, error) {
        //         console.error(xhr, status, error); // Log error details
        //     },
        // });
    });
});