export const getWords = async (startIdx: number, endChar: string, str: string) => {
  let ret = '';
  for (let i = startIdx; str[i] !== endChar; i++) {
    ret += str[i];
  }
  return ret;
};