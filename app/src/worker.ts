import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { QueueService } from './queue/queue.service';
import { SongsService } from './songs/songs.service';

async function main() {
  const log = new Logger('Worker');
  const app = await NestFactory.createApplicationContext(AppModule);
  const queue = app.get(QueueService);
  const songs = app.get(SongsService);

  const abort = new AbortController();
  let stopping = false;
  const stop = () => {
    stopping = true;
    abort.abort();
  };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);

  log.log('started');
  while (!stopping) {
    let messages;
    try {
      messages = await queue.receive(abort.signal);
    } catch (e) {
      if (stopping) break;
      log.warn(`receive failed: ${(e as Error).message}`);
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    for (const m of messages) {
      try {
        const { id, dto } = JSON.parse(m.Body!);
        await songs.insertSong(dto, id);
        await queue.delete(m.ReceiptHandle!);
      } catch (e) {
        log.error(`message ${m.MessageId} failed: ${(e as Error).message}`);
      }
    }
  }
  await app.close();
}
main();
