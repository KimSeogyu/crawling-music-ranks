import { asyncFetch, checkLineByNeedle, getWords } from '../../../utils';
import { TrackInterface } from '../../../interfaces/track.interface';

export const getMelon = async () => {
  const htmlLines = (await asyncFetch.get('https://www.melon.com/chart/index.htm')).data
    .split('\n')
    .filter((s: string) => s.length > 0);

  const trackList: Array<TrackInterface> = [];
  let data: TrackInterface = {
    agency: '', album: '', name: '', publisher: '', rank: 0, singer: '',
  };
  let flag = 0;
  for (let line of htmlLines) {
    if (await checkLineByNeedle('<span class="rank ">', line) > 0) {
      data.rank = Number(await getWords(
        await checkLineByNeedle('<span class="rank ">', line) + '<span class="rank ">'.length,
        '<',
        line,
      ));
    }

    if (await checkLineByNeedle('javascript:melon.play.playSong', line) > 0) {
      data.name = await getWords(line.indexOf('>') + 1, '<', line);
    }

    if (await checkLineByNeedle('javascript:melon.link.goArtistDetail', line) > 0) {
      data.singer = await getWords(line.indexOf('>') + 1, '<', line);
    }

    const idx = await checkLineByNeedle('<a href="javascript:melon.link.goAlbumDetail(\'', line);
    if (idx > 0) {
      flag++;
      if (flag % 2 == 1) {
        continue;
      }
      data.album = await getWords(idx + '<a href="javascript:melon.link.goAlbumDetail(\''.length, '\'', line);
      trackList.push(data);
      data = {
        agency: '', album: '', name: '', publisher: '', rank: 0, singer: '',
      };
    }
  }

  return Promise.all(trackList.map(async (track, index) => {
    try {
      const resp = await asyncFetch.get('https://www.melon.com/album/detail.htm?albumId=' + track.album);
      const albumHtmlLines = resp.data.split('\n');
      for (let [i, line] of albumHtmlLines.entries()) {
        if (line.includes('발매사')) {
          track.publisher = albumHtmlLines[i + 1].replace('<dd>', '').replace('</dd>', '').trim();
        }
        if (line.includes('기획사')) {
          track.agency = albumHtmlLines[i + 1].replace('<dd>', '').replace('</dd>', '').trim();
        }
      }
      console.log(`MELON request idx:${index}::success`);
      return track;
    } catch (e) {
      console.log(`MELON request idx:${index}::fail`);
      return track;
    }
  }));
};