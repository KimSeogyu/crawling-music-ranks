import { getMelon } from '../src/modules/crawler/melon';
import { getGenie } from '../src/modules/crawler/genie';
import { getVibes } from '../src/modules/crawler/vibe';

describe('전체 테스트', () => {
  test('멜론 차트 100위까지의 데이터', async () => {
    expect((await getMelon()).length).toBe(100);
  });

  test('지니 차트 100위까지의 데이터', async () => {
    expect((await getGenie()).length).toBe(100);
  });

  test('바이브 차트 100위까지의 데이터', async () => {
    expect((await getVibes()).length).toBe(100);
  });
});
