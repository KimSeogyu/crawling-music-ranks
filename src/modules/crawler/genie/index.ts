import { TrackInterface } from '../../../interfaces/track.interface';
import { getWords, asyncFetch, checkLineByNeedle } from '../../../utils';

export const getGenie = async () => {
  const genieTotalUri = 'https://www.genie.co.kr/chart/top200';

  const trackList = [];

  // 페이지에 50개밖에 없어서 2페이지까지 함께 요청한 후 html string formatting
  const htmlLines: Array<string> = (
    (await asyncFetch.get(genieTotalUri)).data +
    (await asyncFetch.get(genieTotalUri + '?pg=2')).data
  )
    .split('\n')
    .filter((el: string) => el.length > 0);

  // 객체 초기화
  let data: TrackInterface = {
    agency: '', album: '', name: '', publisher: '', rank: 0, singer: '',
  };

  for (let [idx, line] of htmlLines.entries()) {

    // 곡명
    if (await checkLineByNeedle('class="title ellipsis" title="재생"', line) > 0) {
      data.name = htmlLines[idx + 8].trim().replace('</a>', '');
    }

    // 가수명
    if (await checkLineByNeedle('class="artist ellipsis" onclick="fnViewArtist(', line) > 0) {
      data.singer = await getWords(await checkLineByNeedle('return false;">', line) + 'return false;">'.length, '<', line);
    }

    // 앨범 id, 음원순위
    const albumIdIndex = await checkLineByNeedle('class="albumtitle ellipsis" onclick="fnViewAlbumLayer(\'', line);
    if (albumIdIndex > 0) {
      data.album = await getWords('class="albumtitle ellipsis" onclick="fnViewAlbumLayer(\''.length + albumIdIndex, '\'', line);
      data.rank = trackList.length + 1;
      trackList.push(data);
      data = {
        agency: '', album: '', name: '', publisher: '', rank: 0, singer: '',
      };
    }
  }
  return Promise.all(trackList.map(async (track: TrackInterface, index) => {
    try {
      const albumHtml = (await asyncFetch.get(`https://www.genie.co.kr/detail/albumInfo?axnm=${track.album}`)).data
        .split('\n')
        .filter((d: string) => d.length > 0);

      let spanIdx = 0;
      for (let line of albumHtml) {
        const albumDataIdx = await checkLineByNeedle('<span class="value">', line);
        if (albumDataIdx > 0) {
          if (++spanIdx === 3) {
            // 발매사
            track.publisher = await getWords(albumDataIdx + '<span class="value">'.length, '<', line);
          } else if (spanIdx === 4) {
            // 소속사
            track.agency = await getWords(albumDataIdx + '<span class="value">'.length, '<', line);
            break;
          }
        }
      }
      console.log(`GENIE request idx:${index}::success`);
      return track;
    } catch (e) {
      console.error(`GENIE request idx:${index}::fail`);
    }
  }));
};