import { getDeleteBtnHtml, updateDiatoUnsavedHtml, masterTitleArr } from "./renderResults.js";


export { createTitlePost, deleteTitlePost, saveTitlePost };



function saveTitlePost(e) {

    const titleId = e.target.dataset.imdbId;
    
    const viewState = document.getElementById(`${titleId}-view-status`);
    const ratingRange = document.getElementById(`${titleId}-rating`);


    const titleOb = new Object();

    titleOb['viewStatus'] = viewState.checked;

    titleOb['rating'] = ratingRange.value;

    titleOb['titleDesc'] = masterTitleArr.find(findMatchImdbId);
    
    function findMatchImdbId(title) {
        return title.imdbId === titleId;
    }

    createTitlePost(titleOb);


    e.target.previousElementSibling.remove();
}




async function createTitlePost(titleData) {


    const fetchBody = getAcfBody(titleData);

    const savedTitleWpId = await attemptSave(fetchBody);

    if (savedTitleWpId !== null) {
        const imdbId = titleData.titleDesc.imdbId;

        const btnSvgPerpenPath = document.getElementById(`${imdbId}-add-btn-line`);
        btnSvgPerpenPath.classList.add('remove');

        saveImdbIdInWpIds(savedTitleWpId, imdbId);
        
        alterSavedTitleDia(savedTitleWpId, imdbId);
        
    }
}


async function attemptSave(bodyOb) {

    try {
        const res = await fetch("/wp-json/wp/v2/title", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-WP-Nonce": watchlistData.nonce
            },
            body: JSON.stringify({
                title: bodyOb.imdb_id,
                status: "private",
                acf: bodyOb
            })
        })

        if (!res.ok) {
    
            res.status === 403 ? alert('Sign up to save titles') : {};
            return null;
        }

        const data = await res.json();

        return data.id;

    } catch (error) {

        return null;
    }
}


function saveImdbIdInWpIds(wpId, imdbId) {
    watchlistData.saved_title_ids[wpId] = imdbId;
}

function alterSavedTitleDia(wpId, imdbId) {
    
    const titleCardDiaFormEl = document.getElementById(`${imdbId}-form`);
    const saveBtnEl = document.getElementById(`${imdbId}-save-btn`);

    const deleteBtnEl = getDeleteBtnHtml(wpId, imdbId);

    saveBtnEl.remove();

    titleCardDiaFormEl.appendChild(deleteBtnEl);
}



async function deleteTitlePost(e) {
    const titleImddbId = e.target.dataset.imdbId;
    const titleWpId = e.target.dataset.wpId; 

    

    const fetchState = attemptDelete(titleWpId);

    if (fetchState) {
        delete watchlistData.saved_title_ids[titleWpId];
        document.getElementById(`${titleImddbId}-add-btn-line`).classList.remove('remove');
        updateDiatoUnsavedHtml(titleImddbId);
    }
}

async function attemptDelete(wpId) {


    try {
        const res = await fetch(`/wp-json/wp/v2/title/${wpId}`, {
            headers: {
                "X-WP-Nonce": watchlistData.nonce
            },
            method: "DELETE"
        });

        if (!res.ok) {
            return null;
        }

        return true;

    } catch (error) {
        return null;
    }
}


function getAcfBody(titleData) {
    const {viewStatus, rating, titleDesc} = titleData;
    const { title, imdbId, poster, actors, dirc, genre, awards, plot, year, time, lang, coun, type } = titleDesc;

    const fetchBody = new Object();

    
    fetchBody["view_status"] = viewStatus !== false ? true : false;
    viewStatus !== false ? fetchBody["rating"] = rating : {};

    title !== null ? fetchBody["title"] = title : {};
    imdbId !== null ? fetchBody["imdb_id"] = imdbId : {};
    genre !== null ? fetchBody["genre"] = genre : {};
    year !== null ? fetchBody["year"] = year : {};
    time !== null ? fetchBody["duration"] = time : {};
    dirc !== null ? fetchBody["dirc"] = dirc : {};
    actors !== null ? fetchBody["actors"] = actors.map(actor => { return actor }).join(", ") : {};
    coun !== null ? fetchBody["country"] = coun : {};
    lang !== null ? fetchBody["language"] = lang : {};
    awards !== null ? fetchBody["awards"] = awards : {};
    type !== null ? fetchBody["title_type"] = type : {};
    plot !== null ? fetchBody["plot"] = plot : {};
    poster !== null ? fetchBody["poster"] = poster : {};

    return fetchBody;
}

