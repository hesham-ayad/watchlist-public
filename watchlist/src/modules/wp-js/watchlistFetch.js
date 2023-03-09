export { updateTitlePost, deleteTitlePost};


async function updateTitlePost(e) {

    const titleWpId = e.target.dataset.wpId;
    const titleImdbId = e.target.dataset.imdbId;

    const viewState = document.getElementById(`${titleImdbId}-view-status`);
    const ratingRange = document.getElementById(`${titleImdbId}-rating`);


    const postData = {
        imdb_id: titleImdbId,
        view_status: viewState.checked,
        rating: viewState.checked ? ratingRange.value : 0
    };

    attemptUpdate(titleWpId, postData );
}


async function attemptUpdate(wpId, bodyOb) {

    try {
        const res = await fetch(`/wp-json/wp/v2/title/${wpId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-WP-Nonce": watchlistData.nonce
            },
            body: JSON.stringify({
                acf: bodyOb
            })
        })

        if (!res.ok) {
            return null;
        }

        const data = await res.json();

        updateCardPosition(wpId, bodyOb.view_status, bodyOb.imdb_id, data.acf.rating);

    } catch (error) {

        return null;
    }
}

function updateCardPosition(wpId, updatedViewStatus, imdbId, userRating) {

    const seenTitleCard = document.getElementById(`${wpId}-seen-title-card`);
    const unseenTitleCard = document.getElementById(`${wpId}-unseen-title-card`);
   
    if (unseenTitleCard !== null && updatedViewStatus === true) {

        const seenTitlesContainer = document.getElementById('seen-titles-container');

        const userRatingEl = getSeenCard(userRating);

        unseenTitleCard.setAttribute('id', `${wpId}-seen-title-card`);
        unseenTitleCard.appendChild(userRatingEl);

        seenTitlesContainer.appendChild(unseenTitleCard);


    } else if (seenTitleCard !== null && updatedViewStatus === false) {

        const unseenTitlesContainer = document.getElementById('unseen-titles-container');

        seenTitleCard.setAttribute('id', `${wpId}-unseen-title-card`);
        seenTitleCard.lastElementChild.remove();

        const ratingInput = document.getElementById(`${imdbId}-rating`);
        ratingInput.value = 0;

        unseenTitlesContainer.appendChild(seenTitleCard);

    } 
    else if (seenTitleCard !== null && updatedViewStatus === true) {

        const cardRatingText = document.getElementById(`${wpId}-user-rating-text`);
        cardRatingText.textContent = userRating;



    }
}


function getSeenCard(userRating) {

    const ratingWrapperEl = document.createElement('span');
    ratingWrapperEl.classList.add('user-rating');
    
    const ratingTextEl = document.createElement('span');
    ratingTextEl.textContent = userRating;

    ratingWrapperEl.appendChild(ratingTextEl);

    return ratingWrapperEl;
}






async function deleteTitlePost(e) {

    const titleWpId = e.target.dataset.wpId; 

    attemptDelete(titleWpId);

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

        deleteTitleCardHtml(wpId);

    } catch (error) {
        return null;
    }
}


function deleteTitleCardHtml(wpId) {
    const seenTitleCard = document.getElementById(`${wpId}-seen-title-card`);
    const unseenTitleCard = document.getElementById(`${wpId}-unseen-title-card`);

    if (unseenTitleCard !== null) {

        unseenTitleCard.remove();

    } else if (seenTitleCard !== null) {

        seenTitleCard.remove();

    }
    
}