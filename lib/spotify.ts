import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

export const searchTrack = async (query: string) => {
    try {
        const data = await spotifyApi.clientCredentialsGrant()
        spotifyApi.setAccessToken(data.body["access_token"])

        const result = await spotifyApi.searchTracks(query, { limit: 1 })
        if (result.body.tracks?.items.length && result.body.tracks.items.length > 0) {
            return result.body.tracks.items[0]
        }
        return null
    } catch (error) {
        console.error("Error searching track:", error)
        return null
    }
}

export const getPlaylist = async (playlistId: string) => {
    try {
        const data = await spotifyApi.clientCredentialsGrant()
        const token = data.body["access_token"]
        // spotifyApi.setAccessToken(token) // Not needed for fetch

        const fields = "tracks.items(track(name,artists(name)))";
        const encodedFields = encodeURIComponent(fields);
        const url = `https://api.spotify.com/v1/playlists/${playlistId}?market=ES&fields=${encodedFields}`;
        console.log(`[Spotify Lib] Fetching playlist from: ${url}`);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
        }

        const playlist = await response.json()
        return playlist
    } catch (error) {
        throw error
    }
}

export const extractPlaylistId = (url: string) => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
}
