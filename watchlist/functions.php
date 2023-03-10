<?php



function watchlist_files() {

	wp_enqueue_style( 'watchlist_css_reset', get_theme_file_uri( '/css/mod-norm.css' ), null, '1.0.0' );
	wp_enqueue_style( 'watchlist_main_styles', get_theme_file_uri( 'style.css' ), null, '1.1.13' );

	wp_enqueue_script( 'common-js', get_theme_file_uri( '/src/common.js' ), null, '1.0.1', true );

	if ( is_page( 'home' ) ) :
		wp_enqueue_style( 'watchlist_home_styles', get_theme_file_uri( '/css/front-page.css' ), null, '1.0.1' );

		wp_enqueue_style( 'watchlist_card_styles', get_theme_file_uri( '/css/movie-card.css' ), null, '1.0.2' );

		wp_enqueue_script( 'watchlist_index-js', get_theme_file_uri( '/src/front-page.js' ), null, '1.0.1', true );

	endif;

	if ( is_page( 'your watchlist' ) && is_user_logged_in() ) :

		wp_enqueue_style( 'watchlist_card_styles', get_theme_file_uri( '/css/movie-card.css' ), null, '1.0.2' );
		wp_enqueue_style( 'watchlist_home_styles', get_theme_file_uri( '/css/watchlist-page.css' ), null, '1.0.1' );

		wp_enqueue_script( 'watchlist_page-js', get_theme_file_uri( '/src/watchlist.js' ), null, '1.0.0', true );

	endif;

	$all_titles = get_saved_titles_imdb_id();

	$now_user = wp_get_current_user();
	if ( is_user_logged_in() && count( $now_user->roles ) === 1 && 'employer' === $now_user->roles[0] ) :
		wp_localize_script(
			'common-js',
			'watchlistData',
			array(
				'root_url'        => get_site_url(),
				'nonce'           => wp_create_nonce( 'wp_rest' ),
				'saved_title_ids' => $all_titles,
				'omdbKey'         => 'xxxxxxx',
				'imdbKey'         => 'xxxxxxx',
			)
		);
	endif;

	if ( is_user_logged_in() && count( $now_user->roles ) === 1 && 'employer' !== $now_user->roles[0] ) :
		wp_localize_script(
			'common-js',
			'watchlistData',
			array(
				'root_url'        => get_site_url(),
				'nonce'           => wp_create_nonce( 'wp_rest' ),
				'saved_title_ids' => $all_titles,
				'omdbKey'         => 'xxxxxxx',
				'imdbKey'         => 'xxxxxxx',
			)
		);
	endif;

	if ( ! is_user_logged_in() ) :
		wp_enqueue_script( 'signed-out', get_theme_file_uri( '/src/signed-out.js' ), null, '1.0.0', true );

		wp_localize_script(
			'common-js',
			'watchlistData',
			array(
				'root_url' => get_site_url(),
				'omdbKey'  => 'xxxxxxx',
				'imdbKey'  => 'xxxxxxx',
			)
		);
	endif;

}
add_action( 'wp_enqueue_scripts', 'watchlist_files' );

function add_module_to_script_tag( $tag, $handle, $src ) {

	if ( 'watchlist_index-js' === $handle || 'watchlist_page-js' === $handle ) :

		$tag = str_replace( 'text/javascript', 'module', $tag );

	endif;

	return $tag;
}
add_filter( 'script_loader_tag', 'add_module_to_script_tag', 10, 3 );


$now_user = wp_get_current_user();
if ( count( $now_user->roles ) === 1 && 'list_maker' === $now_user->roles[0] || ! is_user_logged_in() ) :

	remove_action( 'wp_print_styles', 'print_emoji_styles' );

	function remove_block_styles() {

		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'classic-theme-styles' );
		wp_dequeue_style( 'global-styles' );

	}
	add_action( 'wp_print_styles', 'remove_block_styles' );

endif;


function alter_favicon() {
	printf( "<link rel=\"shortcut icon\" type=\"image/vnd.microsoft.icon\" href=\"%s/favicon.ico\" />\n", esc_url( get_theme_file_uri() ) );
}
add_action( 'wp_head', 'alter_favicon' );


function get_saved_titles_imdb_id() {
	$title_posts_query = new WP_Query(
		array(
			'post_type'      => 'title',
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'author'         => get_current_user_id(),
		)
	);
	wp_reset_postdata();
	$title_post = $title_posts_query->posts;

	$title_posts_titles = wp_list_pluck( $title_post, 'post_title', 'ID' );

	return $title_posts_titles;
}


function watchlist_features() {
	add_theme_support( 'title-tag' );
}
add_action( 'after_setup_theme', 'watchlist_features' );



function redirect_subscribers_to_frontpage( $now_user ) {
	$now_user = wp_get_current_user();

	if ( count( $now_user->roles ) === 1 && 'list_maker' === $now_user->roles[0] ) :
		wp_safe_redirect( site_url( '/' ) );
		exit;
endif;
}
add_action( 'admin_init', 'redirect_subscribers_to_frontpage' );


function auto_redirect_after_logout() {
	wp_safe_redirect( home_url() );
	exit;
}
add_action( 'wp_logout', 'auto_redirect_after_logout' );


function no_subs_admin_bar( $now_user ) {
	$now_user = wp_get_current_user();

	if ( count( $now_user->roles ) === 1 && 'list_maker' === $now_user->roles[0] ) :
		show_admin_bar( false );
	endif;
}
add_action( 'wp_loaded', 'no_subs_admin_bar' );



function filter_title_post_req( $data ) {

	if ( 'title' === $data['post_type'] && 1000 < count_user_posts( get_current_user_id(), 'title' ) ) :
		die( 'You reached your watchlist cap' );
	endif;

	// enforce title posts to be private.

	if ( 'title' === $data['post_type'] && 'trash' !== $data['post_status'] ) :
		$data['post_status'] = 'private';
	endif;

	return $data;
}
add_filter( 'wp_insert_post_data', 'filter_title_post_req' );


// customize login - registration - loggout page //
function wordpress_logo_url() {
	return esc_url( site_url( '/' ) );
}
add_filter( 'login_headerurl', 'wordpress_logo_url' );


function login_css() {
	printf( "<link rel=\"shortcut icon\" type=\"image/vnd.microsoft.icon\" href=\"%s/img/favicon.ico\" />\n", esc_url( get_theme_file_uri() ) );
	printf( "<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"%s/img/apple-touch-icon.png\" />\n", esc_url( get_theme_file_uri() ) );
	printf( "<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"%s/img/favicon-32x32.png\" />\n", esc_url( get_theme_file_uri() ) );
	printf( "<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"%s/img/favicon-16x16.png\" />\n", esc_url( get_theme_file_uri() ) );

	wp_enqueue_style( 'watchlist_css_reset', get_theme_file_uri( '/css/login-style.css' ), null, '1.0.1' );
}
add_action( 'login_enqueue_scripts', 'login_css' );
