import { updateTitlePost, deleteTitlePost } from "./modules/wp-js/watchlistFetch.js";
const mainContainer = document.getElementById('main-watchlist-page');

mainContainer.addEventListener('click', e => {

    if (e.target.hasAttribute('data-title-card-btn')) {
        
        switch (e.target.dataset.titleCardBtn) {

            case 'dia-open-btn':
                e.target.nextElementSibling.showModal();
                break;
            default:
                break; 
        }

    } else if (e.target.hasAttribute('data-dia-btn')) {

        switch (e.target.dataset.diaBtn) {
                
            case 'update':
                e.target.closest('.save-movie-dia').close();
                updateTitlePost(e);
                break;
            
            case 'delete':
                e.target.closest('.save-movie-dia').close();
                deleteTitlePost(e);
                break;

            default:
                break;
        }

    } else if (e.target.hasAttribute('data-title-view-state-btn')) {

        e.target.classList.toggle("bumped");

        const targetConId = document.getElementById(e.target.dataset.titleCon);
        const otherConId = document.getElementById(e.target.dataset.opppsiteCon);
        const otherConBtnId = document.getElementById(e.target.dataset.opppsiteBtn);

        otherConId.classList.contains('expanded') ? otherConId.classList.remove('expanded'): {};
        otherConBtnId.classList.contains('bumped') ? otherConBtnId.classList.remove('bumped'): {};
        targetConId.classList.toggle("expanded");
    }
})