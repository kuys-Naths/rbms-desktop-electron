const loginAcc = window.api;
const insertAcc = window.api;
const sendOTP = window.api;

let myOtp;
let userLogin;
let userPass;
let isLoggedIn = localStorage.getItem('isLoggedIn');

document.addEventListener('DOMContentLoaded', function (arg) {
    checkSession();
});

function checkSession() {
    if (isLoggedIn !== 'true') {
        console.log(isLoggedIn);
        Login();
    } else {
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('username').innerText = localStorage.getItem('sessionUser');
    }
}

//LOGIN
function Login() {
    Swal.fire({
        title: 'Please Sign In first',
        icon: 'info',
        html: `
          <div class="input-group mb-3">
              <span class="input-group-text" style="width: 100px;">Username</span>
              <input id="uname" type="text" aria-label="Username" class="form-control">
          </div>
          <div class="input-group mb-3">
              <span class="input-group-text" style="width: 100px;">Password</span>
              <input id="pass" type="password" aria-label="Password" class="form-control">
              <button id="show-pass" class="btn btn-outline-secondary" type="button">
                <i class="fa fa-eye"></i>
              </button>
          </div>
          <a href="javascript:showNewModal()">click here to create account</a>
      
        `,
        showClass: {
            popup: `
            animate__animated
            animate__fadeInDownBig
            animate__faster
          `,
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDownBig
            animate__faster
          `,
        },
        didOpen: () => {
            const showPassButton = document.getElementById('show-pass');
            const passwordInput = document.getElementById('pass');

            showPassButton.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    showPassButton.innerHTML = '<i class="fa fa-eye-slash"></i>';
                } else {
                    passwordInput.type = 'password';
                    showPassButton.innerHTML = '<i class="fa fa-eye"></i>';
                }
            });
        },
        focusConfirm: false,
        allowOutsideClick: false,
        showDenyButton: true,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Login',
        denyButtonText: `Exit`,
        preConfirm: () => {
            return [document.getElementById('uname').value, document.getElementById('pass').value];
        },
    }).then((result) => {
        if (result.isDenied) {
            window.close();
        } else if (result.value) {
            // Get the form values here
            const [S_Username, S_Password] = result.value;
            userLogin = S_Username;
            userPass = S_Password;
            loginAcc.loginData({ S_Username, S_Password });
            // console.log(S_Username + ', '+ S_Password);
            window.addEventListener('account-found', (event) => {
                const response = event.detail;
                // console.log(response);
                if (response.success === true) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        },
                        didClose: () => {
                            localStorage.setItem('isLoggedIn', 'true');
                            localStorage.setItem('sessionUser', userLogin);
                            document.getElementById('username').innerText = localStorage.getItem('sessionUser');
                            location.reload();
                        },
                        icon: 'success',
                        title: response.message,
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        },
                        icon: 'error',
                        title: response.error,
                        didClose: () => {
                            Login();
                        },
                    });
                }
            });
        }
    });
}

//REGISTER
function showNewModal() {
    Swal.fire({
        title: 'Create Account',
        icon: 'info',
        width: 0.6 * window.innerWidth,
        html: `
        <div class="input-group mb-3">
            <span class="input-group-text" style="width: 155px;">Username</span>
            <input id="uname" type="text" aria-label="Username" class="form-control">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" style="width: 155px;">Password</span>
            <input id="pass" type="password" aria-label="Password" class="form-control">
            <button id="show-pass" class="btn btn-outline-secondary" type="button">
                <i class="fa fa-eye"></i>
              </button>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" style="width: 155px;">Confirm Password</span>
            <input id="cpass" type="password" aria-label="Confirm Password" class="form-control">
            <button id="c-show-pass" class="btn btn-outline-secondary" type="button">
                <i class="fa fa-eye"></i>
              </button>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" style="width: 155px;">Email</span>
            <input id="email" type="email" aria-label="Email" class="form-control">
        </div>
        <div class="input-group mb-3">
            <input id="otp" type="text" class="form-control" placeholder="XXXXX" aria-label="XXXXX" aria-describedby="getOTP">
            <a href="javascript:getOTP()" class="btn btn-dark">Get OTP</a>
        </div>
        `,
        didOpen: () => {
            const showPassButton = document.getElementById('show-pass');
            const passwordInput = document.getElementById('pass');
            const showCPassButton = document.getElementById('c-show-pass');
            const cpasswordInput = document.getElementById('cpass');

            showPassButton.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    showPassButton.innerHTML = '<i class="fa fa-eye-slash"></i>';
                } else {
                    passwordInput.type = 'password';
                    showPassButton.innerHTML = '<i class="fa fa-eye"></i>';
                }
            });
            showCPassButton.addEventListener('click', () => {
                if (cpasswordInput.type === 'password') {
                    cpasswordInput.type = 'text';
                    showCPassButton.innerHTML = '<i class="fa fa-eye-slash"></i>';
                } else {
                    cpasswordInput.type = 'password';
                    showCPassButton.innerHTML = '<i class="fa fa-eye"></i>';
                }
            });
        },
        showConfirmButton: true,
        confirmButtonText: 'Submit',
        showDenyButton: true,
        denyButtonText: `Cancel`,
        focusConfirm: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showClass: {
            popup: `
            animate__animated
            animate__fadeInDownBig
            animate__faster
          `,
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDownBig
            animate__faster
          `,
        },
        preConfirm: () => {
            const modalCon = Swal.getHtmlContainer();
            let uname = modalCon.querySelector('#uname');
            let pass = modalCon.querySelector('#pass');
            let cpass = modalCon.querySelector('#cpass');
            let email = modalCon.querySelector('#email');
            let otp = modalCon.querySelector('#otp');

            if (uname.value === '' || pass.value === '' || email.value === '' || otp.value === '') {
                Swal.showValidationMessage('Please fill out all fields');
                return false;
            }
            if (pass.value !== cpass.value) {
                Swal.showValidationMessage(`Passwords does'nt match`);
                return false;
            }
            if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                Swal.showValidationMessage('Please enter a valid email address');
                return false;
            }

            if (otp.value === '' || otp.value.length !== 5) {
                Swal.showValidationMessage('Please enter a valid OTP');
                return false;
            } else if (otp.value !== myOtp) {
                Swal.showValidationMessage('OTP not Match');
                console.log(otp + ' = ' + myOtp);
                return false;
            }

            return [(S_Username = uname.value), (S_Password = pass.value), (S_Email = email.value)];
        },
    }).then((result) => {
        if (result.isDenied) {
            // location.reload();
            Login();
        } else {
            const [S_Username, S_Password, S_Email] = result.value;
            //   console.log(S_Username + ' ' + S_Password + ' ' + S_Email);
            insertAcc.submitData({ S_Username, S_Password, S_Email });
            window.addEventListener('submit-data-response', (event) => {
                const response = event.detail;
                console.log(response);
                if (response.success === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `${response.message}`,
                        confirmButtonText: 'OKAY',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(() => {
                        // location.reload();
                        Login();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `${response.error}`,
                        confirmButtonText: 'OKAY',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(() => {
                        // location.reload();
                        Login();
                    });
                }
            });
        }
    });
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function getOTP() {
    const emailTo = document.querySelector('#email').value;
    const emailDomain = emailTo.split('@')[1];
    myOtp = makeid(5);
    // console.log(emailTo + " " + myOtp);
    const emailHTML = `
    <div id="welcome">
        <div class="jumbotron" style="background-color: rgb(214, 214, 202); padding-bottom: 75px">
            <h1 class="" style="text-align: center; padding-top: 100px; font-size: 48px">WELCOME TO RBMS</h1>
            <p class="lead" style="margin: auto; text-align: center">HERE IS YOUR OTP</p>
            <p></p>
            <div class="container" style="padding: 10px">
              <div
                  class=""
                  style="
                  margin: auto;
                  background-color: rgb(53, 94, 59);
                  color: rgb(255, 255, 255);
                  width: auto;
                  height: 65px;
                  min-width: 250px;
                  max-width: 500px;
                  text-align: center;
                  line-height: 55px;
                  letter-spacing: 5px;
                  border-style: solid;
                  font-size: 28px;
                  "
              >
                  ${myOtp}
              </div>
            </div>
        </div>

        <footer class="footer">
            <p>© RBMS 2024</p>
        </footer>
    </div>

    `;

    if (emailTo === '') {
        // Swal.fire({
        //     icon: 'info',
        //     text: `Please enter email`,
        //     toast: true,
        //     timer: 2000,
        //     timerProgressBar: true,
        //     showConfirmButton: false,
        //     didOpen: (toast) => {
        //         toast.addEventListener('mouseenter', Swal.stopTimer);
        //         toast.addEventListener('mouseleave', Swal.resumeTimer);
        //     },
        //     didClose: () => {
        //         showNewModal();
        //     },
        //     position: 'top-end',
        //     allowOutsideClick: false,
        //     allowEscapeKey: false,
        // });
        Toastify({
            text: 'Please Enter Email',
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'left', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
    } else if (!emailTo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        Toastify({
            text: 'Please Enter valid Email',
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'left', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
    } else if (!['gmail.com', 'yahoo.com', 'hotmail.com'].includes(emailDomain)) {
        Toastify({
            text: 'Only Gmail, Yahoo, and Hotmail emails are allowed',
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'left',
            stopOnFocus: true,
        }).showToast();
    } else {
        sendOTP.sendEmail(emailTo, myOtp, emailHTML);

        Toastify({
            text: 'Please check your email for OTP',
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'left', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
    }
}
