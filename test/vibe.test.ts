import { getVibes } from '../src/modules/crawler/vibe';

describe('바이브 크롤링 테스트', () => {
  test('바이브 차트 100위까지의 데이터', async () => {
    expect((await getVibes()).length).toBe(100);
  });
});