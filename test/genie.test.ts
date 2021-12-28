import { getGenie } from '../src/modules/crawler/genie';


describe('지니 크롤링 테스트', () => {
  test('지니 차트 100위까지의 데이터', async () => {
    expect((await getGenie()).length).toBe(100);
  });
});