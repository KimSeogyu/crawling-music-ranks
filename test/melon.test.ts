import { getMelon } from '../src/modules/crawler/melon';

describe('멜론 크롤링 테스트', () => {
  test('멜론 차트 100위까지의 데이터', async () => {
    expect((await getMelon()).length).toBe(100);
  });
});
