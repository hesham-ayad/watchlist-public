<?php

if ( ! is_user_logged_in() ) {
	wp_safe_redirect( site_url( '/' ) );
	exit;
}

function get_saved_titles() {
	$title_posts_query = new WP_Query(
		array(
			'post_type'      => 'title',
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'author'         => get_current_user_id(),
		)
	);
	wp_reset_postdata();

	$title_posts = $title_posts_query->posts;

	$title_posts_id = wp_list_pluck( $title_posts, 'ID' );

	return $title_posts_id;
}
$all_titles = get_saved_titles();




function get_acf_fields( $all_titles ) {

	$post_acf_fields = array();

	foreach ( $all_titles as $imdb_id => $post_id ) {
		$title_fields          = get_fields( $post_id, false );
		$title_fields['wp_id'] = $post_id;
		$post_acf_fields[]     = $title_fields;
	}

	return $post_acf_fields;
}
$title_data = get_acf_fields( $all_titles );



function get_filtered_titles( $title_data ) {

	$unseen_titles = array();
	$seen_titles   = array();

	foreach ( $title_data as $saved_titles ) {

		if ( '1' !== $saved_titles['view_status'] ) {

			$unseen_titles[] = $saved_titles;

		} else {

			$seen_titles[] = $saved_titles;
		}
	}

	$filterd_titles = array(
		'unseen' => $unseen_titles,
		'seen'   => $seen_titles,
	);

	return $filterd_titles;
}

$filtered_titles = get_filtered_titles( $title_data );

get_header();
?>


<main id="main-watchlist-page">


	<section class="view-state-btns-con">

		<button id="unseen-btn" data-title-view-state-btn="unseen-titles-container" data-title-con="unseen-titles-container" data-opppsite-con="seen-titles-container" data-opppsite-btn="seen-btn" type="button">

		<span>
			<span class="btn-text">Unseen</span>
		</span>

		</button>

		<button id="seen-btn" data-title-view-state-btn="seen-titles-container" data-title-con="seen-titles-container" data-opppsite-con="unseen-titles-container" data-opppsite-btn="unseen-btn" type="button">

		<span>
			<span class="btn-text">Seen</span>
		</span>

		</button>

	</section>



	<section class="saved-titles-cards-con">

		<section id="unseen-titles-container" class="titles-con">
				<?php foreach ( $filtered_titles['unseen'] as $unseen_title ) : ?>

					<div id="<?php echo esc_attr( $unseen_title['wp_id'] ); ?>-unseen-title-card" data-view-state="unseen" class="search-card-visiblity search-movie-card-container">

					

						<button class="search-movie-card-add-btn" data-imdb-id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>" data-title-card-btn="dia-open-btn" type="button">
							<span>edit</span>
						</button>



						<dialog id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-dia" class="save-movie-dia">

							<form id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-form" method="dialog" data-form-imdb-id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>" oninput="ratingText.value=rating.value">

								<button class="dia-close-btn" type="submit">close</button>

								<div class="dia-form-inputs">
						
									<input id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-view-status" name="view-status" class="filter-checkbox dial-checkbox" type="checkbox">

									<label for="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-view-status">

										<svg viewBox="0 0 100 100">
											<path class="box" d="M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z"></path>
											<polyline class="check" points="25.5,53.5 39.5,67.5 72.5,34.5 "></polyline>
										</svg>

										<span class="filter-checkbox-text">Seen</span>

									</label>

									<label for="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-rating" class="dia-range-inp-label">

										<span>Rating: </span>

										<input id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-rating" name="rating" type="range" value="0" min="0" max="10" step="0.5">

										<span>

											<output id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-rating-label-text" for="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-rating" name="ratingText">0</output>

											<span> /10</span>

										</span>


									</label>

								</div>

								<div class="dia-fetch-btns-container">

									<button id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-upd-btn"  class="dia-fetch-btn" data-dia-btn="update" data-wp-id="<?php echo esc_attr( $unseen_title['wp_id'] ); ?>" data-imdb-id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>" type="submit">update</button>

									<button id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>-dele-btn" class="dia-fetch-btn" data-dia-btn="delete" data-wp-id="<?php echo esc_attr( $unseen_title['wp_id'] ); ?>" data-imdb-id="<?php echo esc_attr( $unseen_title['imdb_id'] ); ?>" type="submit">delete</button>

								</div>

							</form>

						</dialog>

						<?php if ( array_key_exists( 'poster', $unseen_title ) ) : ?>
							<img loading="lazy" class="search-movie-poster" src="<?php echo esc_attr( $unseen_title['poster'] ); ?>">
						<?php endif ?>
						

						<div class="search-movie-title-container">

							<?php if ( array_key_exists( 'title', $unseen_title ) ) : ?>
								<h4><?php echo esc_html( $unseen_title['title'] ); ?></h4>
							<?php endif ?>

							<?php if ( array_key_exists( 'title_type', $unseen_title ) ) : ?>

								<div class="sep">
									<div class="diamond"></div>
									<div class="diamond"></div>
									<div class="diamond"></div>
									<div class="diamond"></div>
									<div class="diamond"></div>
								</div>

								<?php if ( 'movie' === $unseen_title['title_type'] ) : ?>

									<svg class="movie-svg" viewBox="0 0 48 48">
										<g fill="none" stroke="currentColor">
											<path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path>
											<path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"></path>
											<path stroke-linecap="round" d="M24 44h20"></path>
										</g>
									</svg>

								<?php endif ?>

								<?php if ( 'series' === $unseen_title['title_type'] ) : ?>

									<svg class="series-svg" viewBox="0 0 24 24">
										<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4"></path>
									</svg>

								<?php endif ?>

							<?php endif ?>

						</div>


						<div class="search-movie-description-one">

							
							<?php if ( array_key_exists( 'year', $unseen_title ) ) : ?>
								<p><?php echo esc_html( $unseen_title['year'] ); ?></p>
							<?php endif ?>
								
							<?php if ( array_key_exists( 'duration', $unseen_title ) ) : ?>
								<p><?php echo esc_html( $unseen_title['duration'] ); ?></p>
							<?php endif ?>

							<?php if ( array_key_exists( 'genre', $unseen_title ) ) : ?>
								<p><?php echo esc_html( $unseen_title['genre'] ); ?></p>
							<?php endif ?>
		
							<?php if ( array_key_exists( 'country', $unseen_title ) ) : ?>
								<p><?php echo esc_html( $unseen_title['country'] ); ?></p>
							<?php endif ?>

						</div>

						<div class="search-movie-description-two">

							<?php if ( array_key_exists( 'plot', $unseen_title ) ) : ?>
								<p class="plot"><?php echo esc_html( $unseen_title['plot'] ); ?></p>
								<input class="plot-read-more-btn" type="checkbox" />
							<?php endif ?>

							<div class="cast">

								<?php if ( array_key_exists( 'dirc', $unseen_title ) ) : ?>
									<p>
									<span class="para-signi">Director(s): </span>
										<span><?php echo esc_html( $unseen_title['dirc'] ); ?></span>
									</p>
								<?php endif ?>

								<?php if ( array_key_exists( 'actors', $unseen_title ) ) : ?>
									<p>
										<span class="para-signi">Actor(s): </span>
										<span><?php echo esc_html( $unseen_title['actors'] ); ?></span>
									</p>
								<?php endif ?>

							</div>

							<?php if ( array_key_exists( 'awards', $unseen_title ) ) : ?>
									<p>
										<span class="para-signi">Award(s): </span>
										<span><?php echo esc_html( $unseen_title['awards'] ); ?></span>
									</p>
							<?php endif ?>

							<?php if ( array_key_exists( 'awards', $unseen_title ) ) : ?>
									<p>
										<span class="para-signi">Language(s): </span>
										<span><?php echo esc_html( $unseen_title['language'] ); ?></span>
									</p>
							<?php endif ?>

						</div>

					</div>

				<?php endforeach ?>
		</section>

		<section id="seen-titles-container" class="titles-con">

			<?php foreach ( $filtered_titles['seen'] as $seen_title ) : ?>

				<div id="<?php echo esc_attr( $seen_title['wp_id'] ); ?>-seen-title-card" data-view-state="seen" class="search-card-visiblity search-movie-card-container">


					<button class="search-movie-card-add-btn" data-imdb-id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>" data-title-card-btn="dia-open-btn" type="button">
						<span>edit</span>
					</button>



					<dialog id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-dia" class="save-movie-dia">

						<form id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-form" method="dialog" data-form-imdb-id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>" oninput="ratingText.value=rating.value">

							<button class="dia-close-btn" type="submit">close</button>

							<div class="dia-form-inputs">

								<input id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-view-status" checked name="view-status" class="filter-checkbox dial-checkbox" type="checkbox" >

								<label for="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-view-status">

									<svg viewBox="0 0 100 100">
										<path class="box" d="M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z"></path>
										<polyline class="check" points="25.5,53.5 39.5,67.5 72.5,34.5 "></polyline>
									</svg>

									<span class="filter-checkbox-text">Seen</span>

								</label>

								<label for="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-rating" class="dia-range-inp-label">

									<span>Rating: </span>

									<input id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-rating" name="rating" type="range" value="<?php echo array_key_exists( 'rating', $seen_title ) ? esc_attr( $seen_title['rating'] ) : 0; ?>" min="0" max="10" step="0.5">

									<span>

										<output id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-rating-label-text" for="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-rating" name="ratingText"><?php echo array_key_exists( 'rating', $seen_title ) ? esc_attr( $seen_title['rating'] ) : 0; ?></output>

										<span> /10</span>

									</span>

								</label>

							</div>

							<div class="dia-fetch-btns-container">

								<button id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-upd-btn" class="dia-fetch-btn" data-dia-btn="update" data-wp-id="<?php echo esc_attr( $seen_title['wp_id'] ); ?>" data-imdb-id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>" type="submit">Update</button>
								
								<button id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>-dele-btn" class="dia-fetch-btn" data-dia-btn="delete" data-wp-id="<?php echo esc_attr( $seen_title['wp_id'] ); ?>" data-imdb-id="<?php echo esc_attr( $seen_title['imdb_id'] ); ?>" type="submit">Delete</button>

							</div>

						</form>

					</dialog>

					<?php if ( array_key_exists( 'poster', $seen_title ) ) : ?>
						<img loading="lazy" class="search-movie-poster" src="<?php echo esc_attr( $seen_title['poster'] ); ?>">
					<?php endif ?>

					<div class="search-movie-title-container">

						<?php if ( array_key_exists( 'title', $seen_title ) ) : ?>
							<h4><?php echo esc_html( $seen_title['title'] ); ?></h4>
						<?php endif ?>

						<?php if ( array_key_exists( 'title_type', $seen_title ) ) : ?>

							<div class="sep">
								<div class="diamond"></div>
								<div class="diamond"></div>
								<div class="diamond"></div>
								<div class="diamond"></div>
								<div class="diamond"></div>
							</div>

							<?php if ( 'movie' === $seen_title['title_type'] ) : ?>

								<svg class="movie-svg" viewBox="0 0 48 48">
									<g fill="none" stroke="currentColor">
										<path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path>
										<path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"></path>
										<path stroke-linecap="round" d="M24 44h20"></path>
									</g>
								</svg>

							<?php endif ?>

							<?php if ( 'series' === $seen_title['title_type'] ) : ?>

								<svg class="series-svg" viewBox="0 0 24 24">
									<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4"></path>
								</svg>

							<?php endif ?>

						<?php endif ?>

					</div>


					<div class="search-movie-description-one">



						<?php if ( array_key_exists( 'year', $seen_title ) ) : ?>
							<p><?php echo esc_html( $seen_title['year'] ); ?></p>
						<?php endif ?>

						<?php if ( array_key_exists( 'duration', $seen_title ) ) : ?>
							<p><?php echo esc_html( $seen_title['duration'] ); ?></p>
						<?php endif ?>

						<?php if ( array_key_exists( 'genre', $seen_title ) ) : ?>
							<p><?php echo esc_html( $seen_title['genre'] ); ?></p>
						<?php endif ?>

						<?php if ( array_key_exists( 'country', $seen_title ) ) : ?>
							<p><?php echo esc_html( $seen_title['country'] ); ?></p>
						<?php endif ?>

					</div>

					<div class="search-movie-description-two">

						<?php if ( array_key_exists( 'plot', $seen_title ) ) : ?>
							<p class="plot"><?php echo esc_html( $seen_title['plot'] ); ?></p>
							<input class="plot-read-more-btn" type="checkbox" />
						<?php endif ?>

						<div class="cast">

							<?php if ( array_key_exists( 'dirc', $seen_title ) ) : ?>
								<p>
									<span class="para-signi">Director(s): </span>
									<span><?php echo esc_html( $seen_title['dirc'] ); ?></span>
								</p>
							<?php endif ?>

							<?php if ( array_key_exists( 'actors', $seen_title ) ) : ?>
								<p>
									<span class="para-signi">Actor(s): </span>
									<span><?php echo esc_html( $seen_title['actors'] ); ?></span>
								</p>
							<?php endif ?>

						</div>

						<?php if ( array_key_exists( 'awards', $seen_title ) ) : ?>
								<p>
									<span class="para-signi">Award(s): </span>
									<span><?php echo esc_html( $seen_title['awards'] ); ?></span>
								</p>
						<?php endif ?>

						<?php if ( array_key_exists( 'awards', $seen_title ) ) : ?>
								<p>
									<span class="para-signi">Language(s): </span>
									<span><?php echo esc_html( $seen_title['language'] ); ?></span>
								</p>
						<?php endif ?>

					</div>

					<?php if ( array_key_exists( 'rating', $seen_title ) ) : ?>

						<span class="user-rating">
							<span id="<?php echo esc_attr( $seen_title['wp_id'] ); ?>-user-rating-text">
								<?php echo esc_attr( $seen_title['rating'] ); ?>
							</span>
						</span>

					<?php endif ?>

				</div>

			<?php endforeach ?>
			
		</section>

	</section>


</main>


<button id="scroll-up-btn" class="scroll-up-btn" type="button">
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path fill="currentColor" d="M6.7 11.7q-.275-.275-.275-.7t.275-.7l4.6-4.6q.15-.15.325-.212T12 5.425q.2 0 .375.063t.325.212l4.6 4.6q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275L12 7.825L8.1 11.7q-.275.275-.688.288T6.7 11.7Zm0 6q-.275-.275-.275-.7t.275-.7l4.6-4.6q.15-.15.325-.212t.375-.063q.2 0 .375.063t.325.212l4.6 4.6q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275L12 13.825L8.1 17.7q-.275.275-.688.288T6.7 17.7Z"/>
	</svg>
</button>

<?php get_footer(); ?>
