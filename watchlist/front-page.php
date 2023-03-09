<?php get_header(); ?>

<main id="main-front-page">
	
	<section class="heading-container">

		<div class="main-heading-wrapper">

		<h2 class="primary-heading">Compile your personal list of <span>MOVIES</span> and <span>TV SHOWS</span> and rate them if you&#39;ve seen them</h2>

		</div>

	</section>

	<section class="search-container">



		<div class="primary-inputs-container">

			<div class="primary-inputs">

				<label for="search-title-input" class="search-input-wrapper">
					<span>Title</span>
					<input id="search-title-input" class="search-input" minlength="3" type="search">
				</label>

				<span class="search-filter-btn-wrapper" data-target-panel-id="search-filters-container" data-toggle-panel-btn>

					<span>Filter</span>

					<button class="search-filter-btn" type="button">

					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
						<path fill="currentColor" d="M4.25 5.61C6.57 8.59 10 13 10 13v5c0 1.1.9 2 2 2s2-.9 2-2v-5s3.43-4.41 5.75-7.39c.51-.66.04-1.61-.8-1.61H5.04c-.83 0-1.3.95-.79 1.61z"/>
					</svg>

					</button>

				</span>

				<button id="search-action-btn" class="search-action-btn" type="button">
					<svg viewBox="0 0 24 24">
						<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m20 20l-4.05-4.05m0 0a7 7 0 1 0-9.9-9.9a7 7 0 0 0 9.9 9.9z" />
					</svg>

					<span id="search-btn-tool-tip">text</span>
				</button>

				<div id="sortby-container" class="sortby-container">
					<?php get_template_part( 'template-parts/sort-by' ); ?>
				</div>

			</div>
			<p class="explainer-para">Search by title, filter, or both. You can also sort your results. 
				<span>Remember</span>: Filters are great for exploring.
			</p>

		</div>

		<div class="filter-inputs-container">
			<?php get_template_part( 'template-parts/filter' ); ?>
		</div>

	</section>





	<section class="results-container">


		<div id="results-cards-container" class="results-cards-container">



		<!-- <strong>api calls are finished for the day or something is wrong with the api</strong> -->

			<!-- <div class="search-card-visiblity search-movie-card-container">

				<button
					class="search-movie-card-add-btn"
					data-imdb-id="tt16243818"
					data-search-movie-card-btn="dia-open-btn"
					type="button"
				>
					<svg viewBox="0 0 24 24" fill="none">
					<g>
						<line
						id="tt16243818-add-btn-line"
						class="remove"
						x1="12"
						x2="12"
						y1="2"
						y2="22"
						stroke="black"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-dasharray="20"
						stroke-dashoffset=""
						></line>
						<line
						x1="2"
						y1="12"
						x2="22"
						y2="12"
						stroke="black"
						stroke-width="2.5"
						stroke-linecap="round"
						></line>
					</g>
					</svg>
				</button>

				<dialog id="tt16243818-dia" class="save-movie-dia">
					<form
					id="tt16243818-form"
					method="dialog"
					data-form-imdb-id="tt16243818"
					oninput="ratingText.value=rating.value"
					>
					<button class="dia-close-btn" type="submit">close</button
					><button
						class="dia-del-btn dia-fetch-btn"
						id="tt16243818-dele-btn"
						data-dia-btn="delete"
						data-wp-id="58"
						data-imdb-id="tt16243818"
						type="submit"
					>
						Delete
					</button>
					</form>
				</dialog>
				<div class="search-movie-title-container">
					<h4>ZZZ: Zurnal o Zelimiru Zilniku</h4>
					<div class="sep">
					<div class="diamond"></div>
					<div class="diamond"></div>
					<div class="diamond"></div>
					<div class="diamond"></div>
					<div class="diamond"></div>
					</div>
					<svg class="movie-svg" viewBox="0 0 48 48">
					<g fill="none" stroke="currentColor">
						<path
						stroke-linejoin="round"
						d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"
						></path>
						<path
						stroke-linejoin="round"
						d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"
						></path>
						<path stroke-linecap="round" d="M24 44h20"></path>
					</g>
					</svg>
				</div>

				<div class="search-movie-description-one">
					<p>2021</p>
					<p>90 min</p>
					<p>Documentary</p>
					<p>Serbia</p>
				</div>

				<div class="search-ratings-container">
					<button class="fetch-ratings-btn">
					Get ratings
					</button>
				</div>

				<div class="search-movie-description-two">
					<p class="plot">
					A road movie documentary through half-a-century of filmmaking by Zelimir
					Zilnik, ZZZ (JOURNAL ABOUT ZELIMIR ZILNIK) is also a journey through the
					history of Yugoslavia, a country that no longer exists. With the specific
					style of docudrama that he built over the course of his work, Zilnik
					managed to remain engaged, brave and above all free by making low-budget
					films for decades. We follow the efforts of his team to finish the film
					FREEDOM OR COMICS, which was seized by censors fifty years ago and was
					recently discovered. This is the story of the uninterrupted struggle of
					disenfranchised social and minority groups, who are always the main heroes
					of Zilnik's films.
					</p>

					<input class="plot-read-more-btn" type="checkbox" />

					<div class="cast">
						<p>
							<span class="para-signi">Director: </span>
							<span>Janko Baljak</span>
						</p>
					</div>

					<p>
						<span class="para-signi">award(s): </span>1 nomination
					</p>

					<p>
						<span class="para-signi">language(s): </span>Serbian
					</p>

				</div>

			</div> -->

			<!-- <div
			id="loading-skeleton-element"
			class="search-movie-card-container skeleton-search-movie-card-container"
			>
				<div class="skeleton-search-movie-poster loading-skeleton"></div>

				<div class="search-movie-title loading-skeleton skeleton-text-short"></div>

				<div class="search-movie-description-one skeleton-desc-section-one">
					<div class="loading-skeleton skeleton-text-short"></div>
					<div class="loading-skeleton skeleton-text-short"></div>
					<div class="loading-skeleton skeleton-text-short"></div>
					<div class="loading-skeleton skeleton-text-short"></div>
				</div>

				<div class="search-ratings-container">
					<button type="button" class="skeleton-btn">see ratings</button>
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
			</div> -->

		</div>

		<div id="load-more-btn-container" class="load-more-btn-container"></div>


	</section>

</main>

<button id="scroll-up-btn" class="scroll-up-btn" type="button">
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path fill="currentColor" d="M6.7 11.7q-.275-.275-.275-.7t.275-.7l4.6-4.6q.15-.15.325-.212T12 5.425q.2 0 .375.063t.325.212l4.6 4.6q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275L12 7.825L8.1 11.7q-.275.275-.688.288T6.7 11.7Zm0 6q-.275-.275-.275-.7t.275-.7l4.6-4.6q.15-.15.325-.212t.375-.063q.2 0 .375.063t.325.212l4.6 4.6q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275L12 13.825L8.1 17.7q-.275.275-.688.288T6.7 17.7Z"/>
	</svg>
</button>

<?php get_footer(); ?>
