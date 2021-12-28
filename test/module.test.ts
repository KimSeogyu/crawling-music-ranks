import axios from 'axios';
import { asyncFetch, checkLineByNeedle, getWords } from '../src/utils';

describe('프로젝트 모듈 함수 테스트', () => {

  test('Axios 인스턴스 생성 확인', async () => {
    const myFetcher = await asyncFetch.get('https://www.google.com');
    const originFetcher = await axios.get('https://www.google.com');
    expect(myFetcher.status).toEqual(originFetcher.status);
  });

  test('getWords 테스트', async () => {
    expect(await getWords(0, '!', '안녕하세요!안녕하 세요!')).toEqual('안녕하세요');
    expect(await getWords(6, '!', '안녕하세요!안녕하 세요!')).toEqual('안녕하 세요');
  });

  test('checkLineByNeedle 테스트', async () => {
    expect(await checkLineByNeedle('hello', 'hello world')).toEqual('hello world'.indexOf('hello'));
  });
});