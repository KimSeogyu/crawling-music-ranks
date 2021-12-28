import { crawlingTracks } from './modules/crawler/crawler';
import { cancelJob, scheduleJob } from 'node-schedule';

async function bootstrap() {
  // 10초마다 음원순위를 크롤링합니다
  const jobs = [
    scheduleJob('*/10 * * * * *', crawlingTracks)
  ];

  // 이벤트 로깅
  process.on('uncaughtException', function(err) {
    console.error(err.message);
  });

  // 프로세스 종료시 job cancel
  process.on('SIGINT', function(err: Error) {
    console.error(err);

    jobs.forEach(job => {
      cancelJob(job);
      console.log(`${job.name} cancel success`);
    });

    process.exit(0);
  });
}

bootstrap();