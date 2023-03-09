const authDropDown = document.getElementById('user-auth-drop-down');

const sgInForm = document.getElementById('si-in-form');
const sgUpForm = document.getElementById('si-up-form');

authDropDown.addEventListener('click', switchPanels)

function switchPanels(e) {
    
    switch (e.target.id) {
        case 'si-up':
            sgInForm.classList.contains('active') ? sgInForm.classList.remove('active') : {};

            sgUpForm.classList.contains('active') ? {} : sgUpForm.classList.add('active');
            break;
        
        case 'si-in':
            sgUpForm.classList.contains('active') ? sgUpForm.classList.remove('active') : {};

            sgInForm.classList.contains('active') ? {} : sgInForm.classList.add('active');
            break;
    
        default:
            break;
    }
}


const reg = new URLSearchParams(window.location.search).get('register');

reg === 'true' ? alert('Check your E-mail for password') : {};