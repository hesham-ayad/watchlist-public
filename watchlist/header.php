<!DOCTYPE html>

<html <?php language_attributes(); ?>>

<head>

	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<?php wp_head(); ?>

</head>

<body <?php echo body_class(); ?> >

	<header>
		<nav class="nav-container containers-margin">

				<div class="header-link-wrapper 
				<?php
				if ( is_page( 'home' ) ) {
					echo 'active-header-link-wrapper';
				} else {
					echo 'inactive-header-link-wrapper';
				}
				?>
				">
					<a href="<?php echo esc_url( site_url( '/' ) ); ?>">Home</a>
				</div>

				<span>
					<?php if ( is_user_logged_in() ) { ?>
						<div class="header-link-wrapper 
							<?php
							if ( is_page( 'your watchlist' ) ) {
								echo 'active-header-link-wrapper';
							} else {
								echo 'inactive-header-link-wrapper';
							}
							?>
						">
							<a href="<?php echo esc_url( site_url( '/your-watchlist' ) ); ?>">Your Watchlist</a>
						</div>

						<div class="header-link-wrapper inactive-header-link-wrapper">		
							<a href="<?php echo esc_url( wp_logout_url() ); ?>">Sign Out</a>						
						</div>

					<?php } else { ?>

						<div class="drop-down-wrapper">
							<button class="auth-btn" type="button">Sign In / Up</button>

							<div id="user-auth-drop-down" class="drop-down">
								
								<div class="drop-down-controls">
								<input id="si-in" name="signed-out" type="radio" checked />
								<label for="si-in">Sign in</label>

								<input id="si-up" name="signed-out" type="radio" />
								<label for="si-up">Sign up</label>
								</div>

								<?php global $user_ID, $user_identity; ?>

								<form  id="si-in-form" class="si-in-form active" method="post" action="<?php bloginfo( 'url' ); ?>/wp-login.php">
									<div class="username">
										<label for="user_login">Username:</label>
										<input type="text" name="log" id="user_login" tabindex="11" />
									</div>
									<div class="password">
										<label for="user_pass">Password:</label>
										<input type="password" name="pwd" value="" id="user_pass" tabindex="12" />
									</div>
									<div class="login_btns-con">
										<div class="rememberme">
											<label for="rememberme">
												<input type="checkbox" name="rememberme" value="forever" checked="checked" id="rememberme" tabindex="13" /> Remember me
											</label>
										</div>
										<?php do_action( 'login_form' ); ?>
										<input type="submit" name="user-submit" value="Login" tabindex="14" class="user-submit" />
										<input type="hidden" name="redirect_to" value="<?php echo $_SERVER['REQUEST_URI']; ?>" />
										<input type="hidden" name="user-cookie" value="1" />
									</div>
								</form>

								<form id="si-up-form" class="si-up-form" method="post" action="<?php echo esc_url( site_url( 'wp-login.php?action=register', 'login_post' ) ); ?>">
									<div class="username">
										<label for="user_name">Username:</label>
										<input type="text" name="user_login" id="user_name" tabindex="101" />
									</div>
									<div class="password">
										<label for="user_email">Your Email:</label>
										<input type="text" name="user_email" id="user_email" tabindex="102" />
									</div>
									<div class="login_btns-con">
										<?php do_action( 'register_form' ); ?>
										<input type="submit" name="user-submit" value="Sign up!" class="user-submit" tabindex="103" />
										<input type="hidden" name="redirect_to" value="<?php echo $_SERVER['REQUEST_URI']; ?>?register=true" />
										<input type="hidden" name="user-cookie" value="1" />
									</div>
								</form>
					

							</div>

						</div>

					<?php } ?>
				</span>

		</nav>
	</header>



	
