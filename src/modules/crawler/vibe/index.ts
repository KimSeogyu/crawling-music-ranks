import { TrackInterface } from '../../../interfaces/track.interface';
import { asyncFetch } from '../../../utils';

export const getVibes = async () => {
  const vibeTotalApi = 'https://apis.naver.com/vibeWeb/musicapiweb/vibe/v1/chart/track/total'; // 바이브에서 사용하는 네이버 API
  const vibeDetailApi = 'https://apis.naver.com/vibeWeb/musicapiweb/album/';

  const tracks: Array<any> = (await asyncFetch.get(vibeTotalApi)).data.response.result.chart.items.tracks;

  return Promise.all(tracks.map(async (track: VibeTrack, index) => {
    try {
      const albumDetail = (await asyncFetch.get(vibeDetailApi + track.album.albumId)).data.response.result.album;
      const data: TrackInterface = {
        name: track.trackTitle,
        singer: track.artists[0].artistName,
        album: track.album.albumTitle,
        publisher: albumDetail.productionName,
        agency: albumDetail.agencyName,
        rank: track.rank.currentRank,
      };
      console.log(`VIBE request idx:${index}::success`);
      return data;
    } catch (e) {
      console.log(`VIBE request idx:${index}::fail`);
    }
  }));
};