import axios from 'axios';
import { userAgent } from '../common/constants';
import * as http from 'http';
import * as https from 'https';

export const asyncFetch = axios.create({
  timeout: 10000,
  httpAgent: new http.Agent({ keepAlive: true, maxTotalSockets: 5000 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxTotalSockets: 5000 }),
  maxRedirects: 10,
  headers: { 'User-Agent': userAgent, 'user-agent': userAgent },
});
