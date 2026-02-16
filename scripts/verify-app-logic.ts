import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const run = async () => {
    const { getPlaylist } = await import("../lib/spotify")
    const playlistId = "3cEYpjA9oz9GiPac4AsH4n"

    console.log(`Testing Playlist ID: ${playlistId} using Application Logic`)

    try {
        console.log("Calling getPlaylist from lib/spotify...")
        const playlistData = await getPlaylist(playlistId)
        console.log("Fetch complete.")

        // Verify structure
        console.log("\n--- Response Structure Check ---")
        if (playlistData.tracks && playlistData.tracks.items) {
            console.log(`PASS: 'tracks.items' exists. Count: ${playlistData.tracks.items.length}`)

            const firstItem = playlistData.tracks.items[0];
            if (firstItem && firstItem.track) {
                console.log(`PASS: First item has 'track' property.`)
                console.log(`Track Name: ${firstItem.track.name}`)
                if (firstItem.track.artists && firstItem.track.artists.length > 0) {
                    console.log(`PASS: Artist data exists: ${firstItem.track.artists[0].name}`)
                } else {
                    console.error("FAIL: Artist data missing in first track.")
                }
            } else {
                console.error("FAIL: First item missing 'track' property.")
            }

            // Check for forbidden fields
            if (playlistData.name) console.warn("WARNING: 'name' field is present (should be undefined for restricted query).")
            if (playlistData.description) console.warn("WARNING: 'description' field is present.")
            if (playlistData.images) console.warn("WARNING: 'images' field is present.")
            if (!playlistData.name && !playlistData.description) {
                console.log("PASS: Extra metadata (name, description) is correctly missing.")
            }

        } else {
            console.error("FAIL: 'tracks.items' missing from response.")
            console.log("Received keys:", Object.keys(playlistData))
            if (playlistData.tracks) console.log("Tracks keys:", Object.keys(playlistData.tracks))
        }

    } catch (error) {
        console.error("Test failed with error:", error)
    }
}

run()
