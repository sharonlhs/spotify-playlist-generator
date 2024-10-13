<template>
	<div class="spotify-theme">
		<header class="header">
			<div class="logo">
				<span class="logo-full">Spotify Playlist Generator</span>
				<span class="logo-short">SPG</span>
			</div>
			<div class="auth-buttons">
				<button
					v-if="!isLoggedIn"
					@click="login"
					class="auth-button login-button">
					Login with Spotify
				</button>
				<div
					v-else
					class="user-info">
					<span>{{ userProfile.display_name }}</span>
					<button
						@click="logout"
						class="auth-button logout-button">
						Logout
					</button>
				</div>
			</div>
		</header>

		<main class="main-content">
			<div class="search-wrapper">
				<SearchBarComponent @search="handleSearch" />
			</div>

			<div
				v-if="createdPlaylist"
				class="mt-4">
				<h2>Created Playlist: {{ createdPlaylist.name }}</h2>
				<p>Tracks added:</p>
				<ul>
					<li
						v-for="track in createdPlaylist.tracks"
						:key="track.id">
						{{ track.name }} by
						{{ track.artists.map((a) => a.name).join(', ') }}
					</li>
				</ul>
				<a
					:href="createdPlaylist.external_urls.spotify"
					target="_blank"
					class="spotify-button">
					Open in Spotify
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="inline-block ml-2 w-5 h-5">
						<path
							d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
					</svg>
				</a>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';

	const config = useRuntimeConfig();
	const client_id = config.public.CLIENT_ID;
	const redirect_uri = `${config.public.appUrl}/callback`;
	const scope = 'user-read-private user-read-email playlist-modify-public';

	const isLoggedIn = ref(false);
	const userProfile = ref(null);
	const accessToken = ref('');
	const createdPlaylist = ref(null);

	onMounted(async () => {
		// Check if there's an access token in localStorage
		const storedToken = localStorage.getItem('spotify_access_token');
		if (storedToken) {
			accessToken.value = storedToken;
			await fetchUserProfile();
		}
	});

	const login = () => {
		const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
			scope
		)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
		window.location.href = spotifyAuthUrl;
	};

	const fetchUserProfile = async () => {
		try {
			const response = await fetch('https://api.spotify.com/v1/me', {
				headers: {
					Authorization: `Bearer ${accessToken.value}`,
				},
			});
			userProfile.value = await response.json();
			isLoggedIn.value = true;
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	};

	const handleSearch = async (query: string) => {
		if (!isLoggedIn.value) {
			alert('Please log in first');
			return;
		}

		console.log('Starting search for query:', query);
		console.log('Access token:', accessToken.value ? 'Present' : 'Missing');
		console.log('User profile:', userProfile.value);

		try {
			// Search for tracks
			console.log('Searching for tracks...');
			const searchResponse = await fetch(
				`https://api.spotify.com/v1/search?q=${encodeURIComponent(
					query
				)}&type=track&limit=10`,
				{
					headers: {
						Authorization: `Bearer ${accessToken.value}`,
					},
				}
			);
			if (!searchResponse.ok) {
				throw new Error(
					`Search failed: ${searchResponse.status} ${searchResponse.statusText}`
				);
			}
			const searchData = await searchResponse.json();
			console.log('Search successful, tracks found:', searchData.tracks.items.length);

			// Create a new playlist
			console.log('Creating playlist...');
			const createPlaylistResponse = await fetch(
				`https://api.spotify.com/v1/users/${userProfile.value.id}/playlists`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken.value}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: query,
						description: `Playlist generated for "${query}"`,
						public: true,
					}),
				}
			);
			if (!createPlaylistResponse.ok) {
				throw new Error(
					`Create playlist failed: ${createPlaylistResponse.status} ${createPlaylistResponse.statusText}`
				);
			}
			const playlistData = await createPlaylistResponse.json();
			console.log('Playlist created:', playlistData.id);

			// Add tracks to the playlist
			console.log('Adding tracks to playlist...');
			const trackUris = searchData.tracks.items.map((track: any) => track.uri);
			const addTracksResponse = await fetch(
				`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken.value}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						uris: trackUris,
					}),
				}
			);
			if (!addTracksResponse.ok) {
				throw new Error(
					`Add tracks failed: ${addTracksResponse.status} ${addTracksResponse.statusText}`
				);
			}

			console.log('Tracks added successfully');
			alert('Playlist created successfully!');
			// Set the created playlist data
			createdPlaylist.value = {
				...playlistData,
				tracks: searchData.tracks.items,
			};

			console.log('Playlist creation complete:', createdPlaylist.value);
		} catch (error) {
			console.error('Error creating playlist:', error);
			alert(`Error creating playlist: ${error.message}`);
		}
	};

	const logout = () => {
		// Clear the access token from localStorage
		localStorage.removeItem('spotify_access_token');

		// Reset the application state
		isLoggedIn.value = false;
		userProfile.value = null;
		accessToken.value = '';

		// Redirect to Spotify logout page
		const spotifyLogoutUrl = 'https://www.spotify.com/logout/';
		const appRedirectUrl = window.location.origin;

		// Open Spotify logout page in a new window
		const logoutWindow = window.open(
			spotifyLogoutUrl,
			'Spotify Logout',
			'width=700,height=500,top=40,left=40'
		);

		// Close the logout window after a short delay and redirect back to the app
		setTimeout(() => {
			logoutWindow.close();
			window.location.href = appRedirectUrl;
		}, 2000);
	};
</script>

<style scoped>
	.spotify-theme {
		background-color: #121212;
		color: #ffffff;
		min-height: 100vh;
		padding-top: 60px; /* Add space for the fixed header */
		position: relative;
		overflow: hidden;
	}

	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 60px;
		background-color: #000000;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		z-index: 1000;
	}

	.logo {
		font-size: 1.2rem;
		font-weight: bold;
		color: #1db954;
	}

	.auth-buttons {
		display: flex;
		align-items: center;
	}
	.user-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.auth-button {
		background-color: #1db954;
		color: #ffffff;
		border: none;
		padding: 8px 16px;
		border-radius: 500px;
		cursor: pointer;
		transition: background-color 0.3s, transform 0.1s;
		font-size: 0.9rem;
		font-weight: bold;
	}

	.auth-button:hover {
		background-color: #1ed760;
	}

	.auth-button:active {
		transform: scale(0.95);
	}

	.logout-button {
		background-color: #333;
	}

	.logout-button:hover {
		background-color: #555;
	}

	.main-content {
		padding: 20px;
	}

	.logo {
		font-size: 1.2rem;
		font-weight: bold;
		color: #1db954;
	}

	.logo-full {
		display: inline;
	}

	.logo-short {
		display: none;
	}

	@media (max-width: 768px) {
		.logo-full {
			display: none;
		}

		.logo-short {
			display: inline;
		}

		.user-name {
			display: none;
		}

		.auth-button {
			padding: 6px 12px;
			font-size: 0.8rem;
		}

		.header {
			padding: 0 10px;
		}
	}

	.search-wrapper {
		margin-bottom: 20px;
	}

	h1,
	h2 {
		color: #1db954;
		margin-bottom: 20px;
	}

	button {
		background-color: #1db954;
		color: #ffffff;
		border: none;
		padding: 10px 20px;
		border-radius: 20px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #1ed760;
	}

	input {
		background-color: #282828;
		color: #ffffff;
		border: none;
		padding: 10px;
		border-radius: 4px;
		margin-right: 10px;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		background-color: #282828;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 4px;
	}

	a {
		color: #1db954;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
	.spotify-button {
		display: inline-flex;
		align-items: center;
		background-color: #1db954;
		color: white;
		padding: 10px 20px;
		border-radius: 500px;
		font-weight: bold;
		text-decoration: none;
		transition: all 0.3s ease;
		margin-top: 20px;
		position: fixed;
		bottom: 20px;
		right: 20px;
	}

	.spotify-button:hover {
		background-color: #1ed760;
		transform: scale(1.05);
	}

	.spotify-button:active {
		transform: scale(0.95);
	}
</style>