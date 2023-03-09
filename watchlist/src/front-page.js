import { intiateExternalSearchProtocol } from "./modules/search-js/searchFetchProtocols.js";
import { setFilter } from "./modules/search-js/Filter.js";
import { getRatings } from "./modules/search-js/searchFetchProtocols.js";
import { masterTitleArr, renderMovieRatings } from "./modules/search-js/renderResults.js";
import { deleteTitlePost, saveTitlePost } from "./modules/search-js/searcFetchWpProtocols.js";

export { sortParam };

//main search
const searchBtn = document.getElementById("search-action-btn");
const textInputField = document.getElementById('search-title-input');

const filterOptionsPanel = document.getElementById('search-filters-container');

searchBtn.addEventListener('click', intiateTitlesFetch);


textInputField.addEventListener('keypress', intiateTitlesFetch);


function intiateTitlesFetch(e) {

    if (e.key === 'Enter' || e.target.id === 'search-action-btn') {

        searchBtn.setAttribute('disabled', '');
        textInputField.setAttribute('disabled', '');
    
        setTimeout(() => {
            searchBtn.removeAttribute('disabled');
            textInputField.removeAttribute('disabled');
        }, 3000);



        masterTitleArr.splice(0, masterTitleArr.length - 1);
        filterOptionsPanel.classList.contains('expanded') ? filterOptionsPanel.classList.remove('expanded') : {};
        intiateExternalSearchProtocol();
    }
}






// sort by stuff
const openSortbySelectBtn = document.getElementById('sortby-btn-wrapper');
const sortbycontainer = document.getElementById('sortby-container');
const sortbySelectOverlay = document.getElementById('sortby-custom-select-backdrop');

openSortbySelectBtn.addEventListener('click', () => {
    sortbycontainer.classList.toggle('active');
})

sortbySelectOverlay.addEventListener('click', () => {
    sortbycontainer.classList.remove('active');
})

const sortbtOptions = document.getElementById('sortby-cutom-select').childNodes;
let sortParam = '';
sortbtOptions.forEach(option => {
    option.addEventListener('click', () => {
        sortbycontainer.classList.remove('active');
        sortParam = option.dataset.paramValue;
    })
})

setFilter();

// toggle filter input panels
const togglePanelBtns = document.querySelectorAll('[data-toggle-panel-btn]');
togglePanelBtns.forEach(btn => {

    btn.addEventListener('click', () => {
        const targetPanelId = document.getElementById(btn.dataset.targetPanelId);
        targetPanelId.classList.toggle("expanded");

        if (btn.classList.contains('filter-panel-btn')) {
            btn.classList.toggle("bumped");
        }
    })
})

const searchResContainer = document.getElementById('results-cards-container');

searchResContainer.addEventListener('click', async e => {

    if (e.target.hasAttribute('data-search-movie-card-btn')) {

        switch (e.target.dataset.searchMovieCardBtn) {

            case 'dia-open-btn':
                e.target.nextElementSibling.showModal();
                break;

            case 'ratings':
                const ratings = await getRatings(e.target.dataset.imdbId);
                renderMovieRatings(ratings, e.target);
                break;

            default:
                break;
        }
    } else if (e.target.hasAttribute('data-dia-btn')) {

        switch (e.target.dataset.diaBtn) {

            case 'save':
                saveTitlePost(e);
                break;

            case 'delete':
                e.target.closest('.save-movie-dia').close();
                deleteTitlePost(e);
                break;

            default:
                break;
        }
    }
})




