import { getMoreRes } from "./searchFetchProtocols.js";

export { renderTitleCards, renderMovieRatings, titleCardLoadingSkeleton, getDeleteBtnHtml, updateDiatoUnsavedHtml, masterTitleArr };


const searchResContainer = document.getElementById('results-cards-container');
const moreResBtnContainer = document.getElementById('load-more-btn-container');

let masterTitleArr = new Array;


function renderTitleCards(titleArr) {
    if (titleArr) {

        titleArr.forEach(title => {
            masterTitleArr.push(title);
        });

        const titleCardsFrag = new DocumentFragment();

        titleArr.forEach(title => {
            const titleCard = getTitleCardHtml(title);
            titleCardsFrag.appendChild(titleCard);
        });
        searchResContainer.innerHTML = '';
        searchResContainer.appendChild(titleCardsFrag);

        moreResBtnContainer.innerHTML = `<button id="next-fifty-btn" data-next-patch-value="1" type="button">more results</button>`;
        setMoreResBtnListner();

    }
}

function getTitleCardHtml(titleRes) {
    const { title, imdbId, poster, actors, dirc, genre, awards, plot, year, time, lang, coun, type } = titleRes;

    const saveMovieDia = getSaveDiaHtml(imdbId);

    const posterHtml = poster !== null ? getPosterHtml(poster) : '';
    const titleHtml = title !== null ? getTitleHtml(title, type) : '';
    const genreHtml = genre !== null ? getGenreHtml(genre) : '';
    const yearHtml = year !== null ? getYearHtml(year) : '';
    const runTimeHtml = time !== null ? getRunTimeHtml(time) : '';
    const counHtml = coun !== null ? getCounHtml(coun) : '';
    const dircHtml = dirc !== null ? getDircHtml(dirc) : '';
    const actorsHtml = actors !== null ? getActorsHtml(actors) : '';
    const plotHtml = plot !== null ? getPlotHtml(plot) : '';
    const awardsHtml = awards !== null ? getAwardsHtml(awards) : '';
    const langHtml = lang !== null ? getLangHtml(lang) : '';

    const movieCardEl = document.createElement('div');
    movieCardEl.classList.add('search-card-visiblity');
    movieCardEl.classList.add('search-movie-card-container');

    const actionBtn = getActionBtnHtml(imdbId);

    const firstMovieDescEl = document.createElement('div');
    firstMovieDescEl.classList.add('search-movie-description-one');

    const ratingContEl = document.createElement('div');
    ratingContEl.classList.add('search-ratings-container');

    const getRatingsBtnEl = document.createElement('button');
    getRatingsBtnEl.classList.add('fetch-ratings-btn');
    getRatingsBtnEl.setAttribute('data-search-movie-card-btn', 'ratings');
    getRatingsBtnEl.setAttribute('data-imdb-id', imdbId);
    getRatingsBtnEl.textContent = 'Get ratings';

    const seconedMovieDescEl = document.createElement('div');
    seconedMovieDescEl.classList.add('search-movie-description-two');

    const castContEl = document.createElement('div');
    castContEl.classList.add('cast');

    movieCardEl.appendChild(actionBtn);

    movieCardEl.appendChild(saveMovieDia);

    poster !== null ? movieCardEl.appendChild(posterHtml) : {};

    title !== null ? movieCardEl.appendChild(titleHtml) : {};

    year !== null ? firstMovieDescEl.appendChild(yearHtml) : {};
    
    time !== null ? firstMovieDescEl.appendChild(runTimeHtml) : {};

    genre !== null ? firstMovieDescEl.appendChild(genreHtml) : {};

    coun !== null ? firstMovieDescEl.appendChild(counHtml) : {};

    movieCardEl.appendChild(firstMovieDescEl);

    ratingContEl.appendChild(getRatingsBtnEl);

    movieCardEl.appendChild(ratingContEl);

    plot !== null ? seconedMovieDescEl.appendChild(plotHtml) : {};

    dirc !== null ? castContEl.appendChild(dircHtml) : {};

    actors !== null ? castContEl.appendChild(actorsHtml) : {};

    dirc !== null || actors !== null ? seconedMovieDescEl.appendChild(castContEl) : {};

    awards !== null ? seconedMovieDescEl.appendChild(awardsHtml) : {};

    lang !== null ? seconedMovieDescEl.appendChild(langHtml) : {};

    movieCardEl.appendChild(seconedMovieDescEl);

    return movieCardEl;
};

function getActionBtnHtml(imdbId) {

    const saveCheck = titleSaveStat(imdbId);

    let btnClassStat = saveCheck !== false ? 'remove' : '';

    const actionBtnEl = document.createElement('button');
    actionBtnEl.classList.add('search-movie-card-add-btn');
    actionBtnEl.setAttribute('data-imdb-id', imdbId);
    actionBtnEl.setAttribute('data-search-movie-card-btn', 'dia-open-btn');
    actionBtnEl.setAttribute('type', 'button');

    const actionBtnSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    actionBtnSvg.setAttribute('viewBox', '0 0 24 24');
    actionBtnSvg.setAttribute('fill', 'none');
    actionBtnSvg.innerHTML = `
    <g>
        <line id="${imdbId}-add-btn-line" class="${btnClassStat}" x1="12" x2="12" y1="2" y2="22" stroke="black" stroke-width="2.5"
            stroke-linecap="round" stroke-dasharray="20" stroke-dashoffset="" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="black" stroke-width="2.5"
            stroke-linecap="round" />
    </g>`;
    actionBtnEl.appendChild(actionBtnSvg);

    return actionBtnEl;
}



function getSaveDiaHtml(imdbId) {

    const savetitleCardDiaFragEl = new DocumentFragment();

    const saveDiaEl = document.createElement('dialog');
    saveDiaEl.setAttribute('id', `${imdbId}-dia`);
    saveDiaEl.classList.add('save-movie-dia');

    const formEl = document.createElement('form');
    formEl.setAttribute('id', `${imdbId}-form`);
    formEl.setAttribute('method', 'dialog');
    formEl.setAttribute('data-form-imdb-id', imdbId);
    formEl.setAttribute('oninput', 'ratingText.value=rating.value');

    const closeModBtnEl = document.createElement('button');
    closeModBtnEl.classList.add('dia-close-btn');
    closeModBtnEl.setAttribute('type', 'submit');
    closeModBtnEl.textContent = 'close';

    const formInpHtml = getDiaFormHtml(imdbId);

    formEl.appendChild(closeModBtnEl);
    formEl.appendChild(formInpHtml);

    saveDiaEl.appendChild(formEl);

    savetitleCardDiaFragEl.appendChild(saveDiaEl);


    return savetitleCardDiaFragEl;
}


function getDiaFormHtml(imdbId) {

    const saveCheck = titleSaveStat(imdbId);

    const submitActionBtns = getsubmitActionBtnsHtml(imdbId, saveCheck);

    if (saveCheck === false) {

        const docFrag = new DocumentFragment();

        const diaFormInpConEl = document.createElement('div');
        diaFormInpConEl.classList.add('dia-form-inputs');

        const viewStatInpEl = document.createElement('input');
        viewStatInpEl.setAttribute('id', `${imdbId}-view-status`);
        viewStatInpEl.setAttribute('name', 'view-status');
        viewStatInpEl.setAttribute('type', 'checkbox');
        viewStatInpEl.classList.add('dial-checkbox');

        const viewStatLabEl = document.createElement('label');
        viewStatLabEl.setAttribute('id', `${imdbId}-view-status-label`);
        viewStatLabEl.setAttribute('for', `${imdbId}-view-status`);

        const viewStatInpSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        viewStatInpSvg.setAttribute('viewBox', '0 0 100 100');
        viewStatInpSvg.innerHTML = `
            <path class="box" d="M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z" />
            <polyline class="check" points="25.5,53.5 39.5,67.5 72.5,34.5 " />
        `

        const viewStateTextEl = document.createElement('span');
        viewStateTextEl.classList.add('filter-checkbox-text');
        viewStateTextEl.textContent = 'Seen';

        viewStatLabEl.appendChild(viewStatInpSvg);
        viewStatLabEl.appendChild(viewStateTextEl);


        const ratingLabEl = document.createElement('label');
        ratingLabEl.setAttribute('id', `${imdbId}-rating-label`);
        ratingLabEl.setAttribute('for', `${imdbId}-rating`);
        ratingLabEl.classList.add('dia-range-inp-label');

        const rangeTextEl = document.createElement('span');
        rangeTextEl.textContent = 'Rating: ';


        const ratingInpEl = document.createElement('input');
        ratingInpEl.setAttribute('id', `${imdbId}-rating`);
        ratingInpEl.setAttribute('name', 'rating');
        ratingInpEl.setAttribute('type', 'range');
        ratingInpEl.setAttribute('value', '0');
        ratingInpEl.setAttribute('min', '0');
        ratingInpEl.setAttribute('max', '10');
        ratingInpEl.setAttribute('step', '0.5');
        ratingInpEl.textContent = 'rating: ';

        const rangeOutputConEl = document.createElement('span');

        const rangeOutputEl = document.createElement('output');
        rangeOutputEl.setAttribute('id', `${imdbId}-rating-label-text`);
        rangeOutputEl.setAttribute('for', `${imdbId}-rating`);
        rangeOutputEl.setAttribute('name', 'ratingText');

        const outputReferenceTextEl = document.createElement('span');
        outputReferenceTextEl.textContent = '/ 10';

        
        rangeOutputConEl.appendChild(rangeOutputEl);
        rangeOutputConEl.appendChild(outputReferenceTextEl);

        ratingLabEl.appendChild(rangeTextEl);
        ratingLabEl.appendChild(ratingInpEl);
        ratingLabEl.appendChild(rangeOutputConEl);


        diaFormInpConEl.appendChild(viewStatInpEl);
        diaFormInpConEl.appendChild(viewStatLabEl);
        diaFormInpConEl.appendChild(ratingLabEl);


        docFrag.appendChild(diaFormInpConEl);
        docFrag.appendChild(submitActionBtns);
       

        return docFrag;
    }

    return submitActionBtns;
}


function updateDiatoUnsavedHtml(imdbId) {

    const titleForm = document.getElementById(`${imdbId}-form`);

    const deleteBtnEl = document.getElementById(`${imdbId}-dele-btn`);
    deleteBtnEl.remove();

    const inputHtml = getDiaFormHtml(imdbId);

    titleForm.appendChild(inputHtml);
}

function getsubmitActionBtnsHtml(imdbId, saveCheck) {

    let btnsHtml = '';

    if (saveCheck !== false) {
        btnsHtml = getDeleteBtnHtml(saveCheck, imdbId);

        return btnsHtml;
    }

    btnsHtml = getSaveBtnHtml(imdbId);

    return btnsHtml;
}

function getSaveBtnHtml(imdbId) {

    const saveBtnEl = document.createElement('button');
    saveBtnEl.classList.add('dia-fetch-btn');
    saveBtnEl.setAttribute('id', `${imdbId}-save-btn`);
    saveBtnEl.setAttribute('data-dia-btn', 'save');
    saveBtnEl.setAttribute('data-imdb-id', imdbId);
    saveBtnEl.setAttribute('type', 'submit');
    saveBtnEl.textContent = 'save';

    return saveBtnEl;
}


function getDeleteBtnHtml(wpId, imdbId) {

    const deleteBtnEl = document.createElement('button');
    deleteBtnEl.classList.add('dia-del-btn');
    deleteBtnEl.classList.add('dia-fetch-btn');
    deleteBtnEl.setAttribute('id', `${imdbId}-dele-btn`);
    deleteBtnEl.setAttribute('data-dia-btn', 'delete');
    deleteBtnEl.setAttribute('data-wp-id', wpId);
    deleteBtnEl.setAttribute('data-imdb-id', imdbId);
    deleteBtnEl.setAttribute('type', 'submit');
    deleteBtnEl.textContent = 'Delete';

    return deleteBtnEl;
}

function titleSaveStat(imdbId) {

    const saveCheck = checkWpSaObj(imdbId);

    if (saveCheck !== false) {
        return saveCheck.wpId;
    }

    return false;
}



function checkWpSaObj(imdbId) {

    const wpSavedTitlesIds = watchlistData.saved_title_ids;

    for (const wpSavedTitleId in wpSavedTitlesIds) {

        const savedImdbId = wpSavedTitlesIds[wpSavedTitleId];

        const existCheck = savedImdbId === imdbId ? true : false;

        if (existCheck) {

            return {
                existStatus: existCheck,
                wpId: wpSavedTitleId
            };
        }
    }

    return false;
}


function getPosterHtml(poster) {
    const posterEl = document.createElement('img');
    posterEl.setAttribute('loading', 'lazy');
    posterEl.classList.add('search-movie-poster')
    posterEl.setAttribute('src', poster);

    return posterEl;
}

function getTitleHtml(title, type) {

    const titleContEl = document.createElement('div');
    titleContEl.classList.add('search-movie-title-container');

    const movieTitleEl = document.createElement('h4');
    movieTitleEl.textContent = title;

    const typeEl = getTypeHtml(type);

    titleContEl.appendChild(movieTitleEl);
    type !== null ? titleContEl.appendChild(typeEl) : {};

    return titleContEl;
}

function getTypeHtml(type) {
    const titleTypeEls = new DocumentFragment();

    const separatorEl = document.createElement('div');
    separatorEl.classList.add('sep');
    separatorEl.innerHTML = `
    <div class="diamond"></div>
    <div class="diamond"></div>
    <div class="diamond"></div>
    <div class="diamond"></div>
    <div class="diamond"></div>`


    const movieSvgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    movieSvgEl.classList.add('movie-svg');
    movieSvgEl.setAttribute('viewBox', '0 0 48 48');
    movieSvgEl.innerHTML = `
    <g fill="none" stroke="currentColor">
        <path stroke-linejoin="round"
            d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
        <path stroke-linejoin="round"
            d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
        <path stroke-linecap="round" d="M24 44h20" />
    </g>`


    const seriesSvgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    seriesSvgEl.classList.add('series-svg');
    seriesSvgEl.setAttribute('viewBox', '0 0 24 24');
    seriesSvgEl.innerHTML = `
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4" />`



    if (type === 'movie') {
        titleTypeEls.appendChild(separatorEl);
        titleTypeEls.appendChild(movieSvgEl);

        return titleTypeEls;

    } else if (type === 'series') {
        titleTypeEls.appendChild(separatorEl);
        titleTypeEls.appendChild(seriesSvgEl);

        return titleTypeEls;
    }

    return '';
}

function getGenreHtml(genre) {
    const genreNode = document.createElement('p')
    genreNode.textContent = genre;
    return genreNode;
}

function getYearHtml(year) {
    const yearNode = document.createElement('p')
    yearNode.textContent = year;
    return yearNode;
}

function getRunTimeHtml(runTime) {
    const timeNode = document.createElement('p')
    timeNode.textContent = runTime;
    return timeNode;
}

function getCounHtml(coun) {

    const counNode = document.createElement('p');
    counNode.textContent = coun;
    return counNode;
}

function getDircHtml(dirc) {
    const paraEl = document.createElement('p');

    const dircSignifierEl = document.createElement('span');
    dircSignifierEl.classList.add('para-signi');
    dircSignifierEl.textContent = 'Director(s): ';

    const dircSpanEl = document.createElement('span');
    dircSpanEl.textContent = dirc;

    paraEl.appendChild(dircSignifierEl);
    paraEl.appendChild(dircSpanEl);

    return paraEl;
}

function getLangHtml(lang) {
    const langNode = document.createElement('p')
    langNode.innerHTML = `<span class="para-signi">Language(s): </span>${lang}`;
    return langNode;
}

function getActorsHtml(actors) {
    const namesHtmlArr = actors.map(actor => {
        return `<span>${actor}</span>`;
    }).join(', ')

    const actorsEl = document.createElement('p');
    actorsEl.innerHTML = `<span class="para-signi">Actor(s): </span>${namesHtmlArr}`;

    return actorsEl;
}

function getPlotHtml(plot) {

    const docFrag = new DocumentFragment();

    const plotEl = document.createElement('p')
    plotEl.classList.add('plot');
    plotEl.textContent = plot;

    const readMoreBtn = document.createElement('input');
    readMoreBtn.classList.add('plot-read-more-btn');
    readMoreBtn.setAttribute('type', 'checkbox');

    docFrag.appendChild(plotEl);
    docFrag.appendChild(readMoreBtn);

    return docFrag;
}

function getAwardsHtml(awards) {
    const awardsNode = document.createElement('p');
    awardsNode.innerHTML = `<span class="para-signi">award(s): </span>${awards}`;

    return awardsNode;
}

function titleCardLoadingSkeleton() {
    const skeleton = getSkeletonHtml();
    searchResContainer.innerHTML = skeleton;
}

function getSkeletonHtml() {

    const skeletonHtml =
        `
        <div id="loading-skeleton-element" class="search-movie-card-container skeleton-search-movie-card-container">

        <div class="skeleton-search-movie-poster loading-skeleton"></div>

        <div class="search-movie-title loading-skeleton skeleton-text-short"></div>

        <div class="search-movie-description-one skeleton-desc-section-one">
            <div class="loading-skeleton skeleton-text-short"></div>
            <div class="loading-skeleton skeleton-text-short"></div>
            <div class="loading-skeleton skeleton-text-short"></div>
            <div class="loading-skeleton skeleton-text-short"></div>
        </div>

        <div class="search-ratings-container">
            <button type="button" class="skeleton-btn">Get ratings</button>
        </div>

        <div class="search-movie-description-two skeleton-desc-section-two">

            <div class="cast">
                <div class="loading-skeleton skeleton-text-long"></div>
                <div class="loading-skeleton skeleton-text-long"></div>
            </div>
            <div class="plot">
                <div class="loading-skeleton skeleton-text-even-longer"></div>
                <div class="loading-skeleton skeleton-text-longer"></div>
            </div>
            <div class="loading-skeleton skeleton-text-long"></div>
            <div class="loading-skeleton skeleton-text-long"></div>
        </div>

    </div>
    `

    return skeletonHtml;
}

function setMoreResBtnListner() {

    const nextFifBtn = document.getElementById('next-fifty-btn');
    nextFifBtn.addEventListener('click', async () => {
        const startParam = Number(nextFifBtn.dataset.nextPatchValue) + 50;

        moreMovieCardLoadingSkeleton();

        const moreRes = await getMoreRes(startParam);

        nextFifBtn.dataset.nextPatchValue = startParam;

        renderMoreRes(moreRes);
    })
}

function renderMoreRes(titleArr) {

    if (titleArr !== null) {

        titleArr.forEach(movie => {
            masterTitleArr.push(movie);
        });

        const titleCardsFrag = new DocumentFragment();

        titleArr.forEach(title => {
            const titleCard = getTitleCardHtml(title);
            titleCardsFrag.appendChild(titleCard);
        });

        document.getElementById('loading-skeleton-element').remove();

        searchResContainer.appendChild(titleCardsFrag);

    } else {
        document.getElementById('loading-skeleton-element').remove();

        document.getElementById('load-more-btn-container').innerHTML = `<p>No more matches</p>`;
    }
}

function moreMovieCardLoadingSkeleton() {
    const skeleton = getSkeletonHtml();
    searchResContainer.innerHTML += skeleton;
}

function renderMovieRatings(ratings, btn) {
    const raingsContainer = btn.closest('.search-ratings-container');

    const { filmAffinity, imDb, metacritic, rottenTomatoes, theMovieDb } = ratings

    const filmAffinityHtml = filmAffinity === null || filmAffinity.length > 0 ? getAffinityHtml(filmAffinity) : '';
    const imdbHtml = imDb === null || imDb.length > 0 ? getImdbHtml(imDb) : '';
    const metacriticHtml = metacritic === null || metacritic.length > 0 ? getMetaHtml(metacritic) : '';
    const rotTomHtml = rottenTomatoes === null || rottenTomatoes.length > 0 ? getRotTomHtml(rottenTomatoes) : '';
    const theMovDbHtml = theMovieDb === null || theMovieDb.length > 0 ? getTheMovDbHtml(theMovieDb) : '';

    const ratingsHtml = [filmAffinityHtml, imdbHtml, metacriticHtml, rotTomHtml, theMovDbHtml].join('');

    raingsContainer.innerHTML = ratings.errorMessage.length === 0 && ratingsHtml.length > 0 ? ratingsHtml : '<p>none were found</p>';

}

function getAffinityHtml(rating) {
    return `
    <span>
        <svg class="film-affinity-svg" fill="none" viewBox="0 0 24 24">
            <path clip-rule="evenodd"
                d="M1.5 2C1.5 1.72386 1.72386 1.5 2 1.5H22C22.2761 1.5 22.5 1.72386 22.5 2V22C22.5 22.2761 22.2761 22.5 22 22.5H2C1.72386 22.5 1.5 22.2761 1.5 22V2ZM2.5 2.5V21.5H21.5V2.5H2.5Z"
                fill="black" fill-rule="evenodd" />
            <path clip-rule="evenodd"
                d="M7.76727 8.73223C7.6564 8.62137 7.49995 8.56892 7.34466 8.59058L6.27837 8.73927L5.31022 8.26836C5.16923 8.19977 5.00423 8.2013 4.86452 8.27248C4.72482 8.34367 4.6266 8.47626 4.59921 8.63064L4.41113 9.69068L3.66408 10.4659C3.55529 10.5788 3.50575 10.7362 3.53028 10.8911C3.55481 11.0459 3.65056 11.1803 3.78892 11.2541L4.73896 11.7605L5.24541 12.7106C5.31917 12.8489 5.45355 12.9447 5.60841 12.9692C5.76328 12.9937 5.92067 12.9442 6.03358 12.8354L6.80882 12.0884L7.86886 11.9003C8.02324 11.8729 8.15584 11.7747 8.22702 11.635C8.2982 11.4953 8.29973 11.3303 8.23114 11.1893L7.76023 10.2211L7.90892 9.15484C7.93058 8.99956 7.87814 8.8431 7.76727 8.73223ZM6.82707 9.67243L6.74878 10.2338C6.73507 10.3322 6.75094 10.4323 6.79436 10.5216L7.0423 11.0313L6.48418 11.1304C6.38644 11.1477 6.29607 11.1937 6.22458 11.2626L5.81642 11.6559L5.54977 11.1557C5.50307 11.0681 5.43135 10.9964 5.34375 10.9497L4.84355 10.6831L5.23687 10.2749C5.30576 10.2034 5.3518 10.1131 5.36914 10.0153L5.46817 9.45721L5.9779 9.70514C6.06717 9.74857 6.16735 9.76443 6.26567 9.75072L6.82707 9.67243Z"
                fill="black" fill-rule="evenodd" />
            <path clip-rule="evenodd"
                d="M12.1214 3.87868C12.0106 3.76781 11.8541 3.71537 11.6988 3.73703L10.3283 3.92815L9.08386 3.32285C8.94286 3.25427 8.77786 3.2558 8.63816 3.32698C8.49845 3.39816 8.40023 3.53075 8.37284 3.68513L8.13109 5.04768L7.17087 6.04414C7.06207 6.15704 7.01254 6.31444 7.03706 6.4693C7.06159 6.62417 7.15734 6.75855 7.2957 6.83231L8.51685 7.48328L9.16782 8.70443C9.24158 8.84279 9.37596 8.93854 9.53082 8.96307C9.68569 8.98759 9.84308 8.93806 9.95599 8.82926L10.9525 7.86904L12.315 7.62729C12.4694 7.5999 12.602 7.50167 12.6731 7.36197C12.7443 7.22227 12.7459 7.05727 12.6773 6.91627L12.072 5.67185L12.2631 4.30129C12.2848 4.146 12.2323 3.98955 12.1214 3.87868ZM11.1812 4.81888L11.0605 5.68456C11.0468 5.78288 11.0627 5.88305 11.1061 5.97232L11.4884 6.75833L10.6278 6.91103C10.5301 6.92837 10.4397 6.97441 10.3682 7.0433L9.73883 7.64979L9.32766 6.87849C9.28096 6.79089 9.20924 6.71917 9.12164 6.67247L8.35034 6.2613L8.95683 5.63191C9.02572 5.56043 9.07176 5.47006 9.0891 5.37232L9.2418 4.5117L10.0278 4.89402C10.1171 4.93744 10.2173 4.95331 10.3156 4.9396L11.1812 4.81888Z"
                fill="black" fill-rule="evenodd" />
            <path clip-rule="evenodd"
                d="M17.5001 9.5C17.7273 9.5 17.9259 9.6531 17.9837 9.87275L20.4837 19.3728L19.5166 19.6272L17.5001 11.9647L15.4837 19.6272L14.5166 19.3728L17.0166 9.87275C17.0744 9.6531 17.273 9.5 17.5001 9.5Z"
                fill="black" fill-rule="evenodd" />
            <path clip-rule="evenodd" d="M16 15.5H19V16.5H16V15.5Z" fill="black" fill-rule="evenodd" />
            <path clip-rule="evenodd" d="M10 10C10 9.72386 10.2239 9.5 10.5 9.5H14V10.5H11V19.5H10V10Z" fill="black"
                fill-rule="evenodd" />
            <path clip-rule="evenodd" d="M14 14.5H10.5V13.5H14V14.5Z" fill="black" fill-rule="evenodd" />
        </svg>
        <p class="rating-text">${rating}</p>
    </span>`;
}

function getImdbHtml(rating) {
    return `
    <span>
        <svg class="imdb-svg" viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M22.378 0H1.622a1.721 1.721 0 0 0-1.62 1.595L0 22.378c.058.876.712 1.543 1.556 1.62a.337.337 0 0 0 .045.002h20.797a.458.458 0 0 0 .043-.002A1.723 1.723 0 0 0 24 22.29V1.71A1.72 1.72 0 0 0 22.415.002A.33.33 0 0 0 22.378 0zm0 .496a1.214 1.214 0 0 1 1.125 1.214v20.58c0 .637-.487 1.16-1.104 1.214H1.602a1.214 1.214 0 0 1-1.106-1.126V1.628A1.21 1.21 0 0 1 1.622.496h20.756zM4.795 8.26v7.364H2.89V8.26h1.905zm6.537 0v7.364H9.671v-4.97L9 15.623H7.813l-.699-4.862l-.006 4.862H5.44V8.26h2.468c.075.448.149.97.23 1.574l.272 1.871l.44-3.445h2.482zm2.977 1.33a.28.28 0 0 1 .142.203c.028.095.035.311.035.644v2.855c0 .488-.035.786-.096.895c-.06.115-.23.17-.502.17V9.52c.204 0 .346.02.421.068zm-.02 6.034c.454 0 .8-.027 1.024-.074c.23-.048.42-.136.57-.265a.961.961 0 0 0 .324-.522c.061-.224.102-.665.102-1.322v-2.584c0-.698-.027-1.166-.074-1.403a1.277 1.277 0 0 0-.313-.644c-.169-.197-.42-.333-.745-.421c-.32-.081-.854-.129-1.77-.129h-1.424v7.364h2.305zm5.14-1.783c0 .353-.02.576-.055.671c-.033.095-.19.142-.305.142c-.108 0-.19-.047-.224-.135c-.04-.088-.06-.298-.06-.623v-1.947c0-.333.02-.543.054-.624c.034-.08.108-.122.217-.122c.115 0 .27.041.311.142c.041.095.061.299.061.604v1.892zm-2.475-5.58v7.363h1.715l.115-.468c.156.19.326.333.516.428c.182.088.46.135.678.135c.304 0 .563-.075.78-.237a1.05 1.05 0 0 0 .42-.563c.054-.217.088-.543.088-.984v-2.067a7.2 7.2 0 0 0-.034-.868a1.025 1.025 0 0 0-.17-.42a1.013 1.013 0 0 0-.427-.333a1.929 1.929 0 0 0-1.342.013a1.629 1.629 0 0 0-.509.4v-2.4h-1.83z" />
        </svg>
        <p class="rating-text">${rating}</p>
    </span>
    `;
}

function getMetaHtml(rating) {
    return `
    <span>
        <img class="metacritic-svg-img" src="https://watchlist.hesham.studio/wp-content/uploads/2023/02/metacritic-logo.svg"></img>
        <p class="rating-text">${rating}</p>
    </span>
    `;
}

function getRotTomHtml(rating) {
    return `
    <span>
        <img class="rotten-tomato-svg-img" src="https://watchlist.hesham.studio/wp-content/uploads/2023/02/rotten-tomatoes-logo.svg">
        <p class="rating-text">${rating}%</p>
    </span>
    `;
}


function getTheMovDbHtml(ratings) {
    return `
    <span>
        <svg class="tmdb-svg" viewBox="0 0 32 32">
            <path fill="currentColor"
            d="M25.99 29.198c2.807 0 4.708-1.896 4.708-4.708V4.709c0-2.807-1.901-4.708-4.708-4.708H6.011c-2.807 0-4.708 1.901-4.708 4.708v27.292l2.411-2.802V4.709a2.3 2.3 0 0 1 2.297-2.292h19.974a2.292 2.292 0 0 1 2.292 2.292V24.49a2.292 2.292 0 0 1-2.292 2.292H9.23l-2.417 2.417l-.016-.016zM11.714 15.286h-2.26v7.599h2.26c5.057 0 5.057-7.599 0-7.599zm0 6.079h-.734v-4.557h.734c2.958 0 2.958 4.557 0 4.557zm-.438-7.511h1.516V7.771h1.891V6.266H9.381v1.505h1.896zm7.474-4.255l-2.625-3.333h-.49v7.714h1.542V9.74l1.573 2.042l1.578-2.042l-.01 4.24h1.542V6.266h-.479zm2.563 9.49c.474-.333.677-.922.698-1.5c.031-1.339-.807-2.307-2.156-2.307H16.85v7.609h3.005a2.265 2.265 0 0 0 2.245-2.26v-.036a1.82 1.82 0 0 0-.781-1.5zm-2.943-2.287h1.354c.432 0 .698.339.698.766a.703.703 0 0 1-.698.76H18.37zm1.354 4.568H18.37v-1.516h1.37c.411 0 .745.333.745.745v.016a.75.75 0 0 1-.75.755z" />
        </svg>
        <p class="rating-text">${ratings}</p>
    </span>
    `;
}






