const r = document.querySelector(':root');

if (navigator.appVersion.indexOf("Win")!=-1) {
    r.style.setProperty('--scroll-bar-compensation-small', '18px')
    r.style.setProperty('--scroll-bar-compensation-large', '17px')
}


const toUpBtn = document.getElementById('scroll-up-btn');

toUpBtn.addEventListener('click', () => {
    document.documentElement.scrollTop = 0;
})

document.addEventListener('scroll', (e) => {
    if (document.documentElement.scrollTop >= 2000) {
        toUpBtn.classList.contains('active') ? {} : toUpBtn.classList.add('active');
    } else {
        toUpBtn.classList.contains('active') ? toUpBtn.classList.remove('active') : {};        
    }
})
