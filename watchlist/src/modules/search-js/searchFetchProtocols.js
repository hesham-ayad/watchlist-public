import { sortParam } from "../../front-page.js?ver=1.0.1";
import { filter } from "./Filter.js";
import { attemptFetch } from "./fetchFunc.js";
import { renderTitleCards, titleCardLoadingSkeleton } from "./renderResults.js";

export { intiateExternalSearchProtocol, getRatings, getMoreRes };

const searchBtn = document.getElementById("search-action-btn");
const textInputField = document.getElementById('search-title-input');

const searchBtnTooltipEl = document.getElementById('search-btn-tool-tip');
const titleInput = document.getElementById('search-title-input');

const searchResContainer = document.getElementById('results-cards-container');

async function intiateExternalSearchProtocol() {
    const advSeaIdArr = await getAdvSeaArr();
    const infoArr = advSeaIdArr !== null ? await getDetailsArr(advSeaIdArr) : null;
    advSeaIdArr !== null ? renderTitleCards(infoArr) : {};
};


async function getAdvSeaArr() {

    const filterParams = getFilterUrlSegment();

    const searchTextInput = titleInput.value.length > 0 && titleInput.validity.valid ? titleInput.value : null;

    const fetchUrl = filterParams !== null || searchTextInput !== null ? ` https://imdb-api.com/API/AdvancedSearch/${watchlistData.imdbKey}?${searchTextInput !== null ? 'title=' + searchTextInput : ''}${filterParams !== null ? '&' + filterParams : ''}${sortParam.length > 0 ? `&sort=${sortParam}` : ''}` : null;

    if (fetchUrl !== null) {
        titleCardLoadingSkeleton();

        const advSeaResArr = await attemptFetch(fetchUrl);

        if (advSeaResArr !== null) {
            globalFetchUrl = fetchUrl;

            const advSeaIdArr = advSeaResArr !== null && advSeaResArr.results !== null && advSeaResArr.results.length > 0 ? advSeaResArr.results.map(movie => { return movie.id }) : null;

            advSeaResArr.errorMessage !== null ? advSeaResArr.errorMessage.length > 0 ? alertUser("Api calls are finished for the day or something is wrong with the api") : {} : {};
            advSeaResArr.results !== null ? advSeaResArr.results.length > 0 ? {} : alertUser('NO MATCHES WERE FOUND'): {};

            return advSeaIdArr;
        }
    }


    searchBtnTooltipEl.textContent = 'at least one parameter';
    searchBtnTooltipEl.classList.add('alert');

    searchBtn.removeAttribute('disabled');
    textInputField.removeAttribute('disabled');

    setTimeout(() => {
        searchBtnTooltipEl.classList.remove('alert');
       
        
    }, 3000);


    return null;
}


function alertUser(alertText) {

    searchResContainer.innerHTML = `<strong>${alertText}</strong>`;

}



async function getDetailsArr(idArr) {
    let validResArr = new Array;

    const omdbPromArr = idArr.map(imdbId => {
        return attemptFetch(`https://www.omdbapi.com/?apikey=${watchlistData.omdbKey}&i=${imdbId}&plot=full`);
        
    })

    if (omdbPromArr !== null) {

        const omdbResArr = await Promise.all(omdbPromArr);

        omdbResArr.map(res => {
            res.Response !== "True" || (res.Type === "episode" || res.Type === "game") ? {} : validResArr.push(trimOmdbRes(res));
        })

        return validResArr;
    }

    return null;
}


function trimOmdbRes(res) {

    return {
        title: res.Title,
        imdbId: res.imdbID,
        year: res.Year === 'N/A' ? null : res.Year,
        genre: res.Genre === 'N/A' ? null : res.Genre,
        type: res.Type === 'N/A' ? null : res.Type,
        lang: res.Language === 'N/A' ? null : res.Language,
        coun: res.Country === 'N/A' ? null : res.Country,
        dirc: res.Director === 'N/A' ? null : res.Director,
        actors: res.Actors === 'N/A' ? null : getActorsArr(res.Actors),
        awards: res.Awards === 'N/A' ? null : res.Awards,
        time: res.Runtime === 'N/A' ? null : res.Runtime,
        year: res.Year === 'N/A' ? null : res.Year,
        poster: res.Poster === 'N/A' ? null : res.Poster,
        plot: res.Plot === 'N/A' ? null : res.Plot
    }
}


function getActorsArr(actorsString) {

    const actorsArr = actorsString.split(",");

    const formattedActorsArr = actorsArr.map(actor => {
        return actor.trim();
    })

    return formattedActorsArr;
}

function getFilterUrlSegment() {

    const titleTypeParameters = filter.type.length ? getParamUrlString(filter.type, 'title_type') : null;
    const genreParameters = filter.genre.length ? getParamUrlString(filter.genre, 'genre') : null;
    const ratingParameters = Object.keys(filter.rating.from).length || Object.keys(filter.rating.to).length ? getParamUrlString(filter.rating, 'rating') : null;
    const dateParameters = Object.keys(filter.date.from).length || Object.keys(filter.date.to).length ? getParamUrlString(filter.date, 'date') : null;
    const countryParameters = filter.country.length ? getParamUrlString(filter.country, 'countries') : null;
    const langParameters = filter.lang.length ? getParamUrlString(filter.lang, 'languages') : null;
    const keywordParameters = filter.keywords.length ? getParamUrlString(filter.keywords, 'keywords') : null;
    const plotParameter = filter.plot.length ? getParamUrlString(filter.plot, 'plot') : null;

    const paramsArr = [titleTypeParameters, genreParameters, countryParameters, langParameters, keywordParameters, plotParameter, ratingParameters, dateParameters];

    const activeParamsArr = new Array;
    for (let i = 0; i < paramsArr.length; i++) {
        paramsArr[i] !== null ? activeParamsArr.push(paramsArr[i]) : {};
    }

    const filterParamsUrlSegment = activeParamsArr.map(param => {
        return param !== null ? param : '';
    }).join('&');

    return filterParamsUrlSegment.length > 0 ? filterParamsUrlSegment : null;
}

function getParamUrlString(filterInput, filterType) {
    let paramString = null;
    let urlString = null;

    switch (filterType) {
        case 'title_type':
            paramString = filterInput.map(item => {
                const p = item === 'documentary' || item === 'short' ? item : `tv_${item}`;
                return p
            }).join(",");
            urlString = `title_type=${paramString}`;
            return urlString;

        case 'genre':
            paramString = filterInput.map(item => {
                const p = item.includes('-') ? item.replace('-', '_') : item;
                return p
            }).join(",");
            urlString = `genres=${paramString}`;
            return urlString;

        case 'rating':
            return `user_rating=${filterInput.from.length > 0 ? filterInput.from : ''},${filterInput.to.length > 0 ? filterInput.to : ''}`;

        case 'date':
            return `release_date=${filterInput.from.length > 0 ? filterInput.from + `-01-01` : ''},${filterInput.to.length > 0 ? filterInput.to + `-12-01` : ''}`;

        case 'countries':
        case 'languages':
            paramString = filterInput.map(item => {
                const p = item.weird;
                return p
            }).join(",");
            urlString = `${filterType}=${paramString}`;
            return urlString;

        case 'keywords':
            paramString = filterInput.map(item => {
                return item;
            }).join(",");
            urlString = `keywords=${paramString}`;
            return urlString;

        case 'plot':
            paramString = filter.plot;
            urlString = `plot=${paramString}`;
            return urlString;

        default:
            break;
    }
}

function getRatings(imdbId) {
    const fetcheUrl = `https://imdb-api.com/en/API/Ratings/k_26yxp82e/${imdbId}`
    const resObj = attemptFetch(fetcheUrl);
    return resObj;
}


let globalFetchUrl = null;

async function getMoreRes(currentPage) {

    const moreResFetchUrl = `${globalFetchUrl}&start=${currentPage}&ref_=adv_nxt`

    const advSeaResArr = await attemptFetch(moreResFetchUrl);

    if (advSeaResArr !== null && advSeaResArr.results.length !== 0 && advSeaResArr.errorMessage === null) {
        const advSeaIdArr = advSeaResArr.results.map(movie => { return movie.id })

        const infoArr = advSeaIdArr !== null ? getDetailsArr(advSeaIdArr) : null;

        return infoArr;
    }
    return null;
}