<?php

function watchlist_post_types() {
	register_post_type(
		'title',
		array(
			'capability_type' => 'title',
			'map_meta_cap'    => true,
			'show_in_rest'    => true,
			'show_ui'         => true,
			'supports'        => array( 'title' ),
			'public'          => false,
			'labels'          => array(
				'name'          => 'Titles',
				'add_new_item'  => 'Add New Title',
				'edit_item'     => 'Edit Note',
				'all_items'     => 'All Titles',
				'singular_name' => 'Title',
			),
			'menu_icon'       => 'dashicons-media-document',
		)
	);
}

add_action( 'init', 'watchlist_post_types' );
