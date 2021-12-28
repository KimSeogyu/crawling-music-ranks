interface VibeTrack {
  trackId: number
  artists: { artistName: string }[];
  album: { albumTitle: string, albumId: number }
  trackTitle: string;
  rank: { currentRank: number };
}