import { test, expect } from '@playwright/test';
import { fetchPlaylistTracks } from '../../lib/scraper';
import path from 'path';

test.describe('Spotify Scraper E2E (Mocked)', () => {
    test('should scrape tracks from a local mock page', async () => {
        // This is a unit test for the scraper logic using Playwright, 
        // but run within the E2E context to verify the selectors against a real DOM.

        const mockFilePath = `file://${path.resolve(__dirname, '../fixtures/mock-spotify.html')}`;

        // Scrape from the local file
        const tracks = await fetchPlaylistTracks('mock-id', undefined, mockFilePath);

        expect(tracks).toHaveLength(3);
        expect(tracks[0]).toEqual({ title: 'Song One', artists: 'Artist A' });
        expect(tracks[1]).toEqual({ title: 'Song Two', artists: 'Artist B' });
        expect(tracks[2]).toEqual({ title: 'Song Three', artists: 'Artist C' });
    });
});
