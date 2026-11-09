import { Injectable } from '@nestjs/common';
import {
  DeleteMessageCommand,
  Message,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

@Injectable()
export class QueueService {
  private readonly sqs = new SQSClient({});
  private readonly url = process.env.QUEUE_URL!;
  readonly asyncWrites = process.env.ASYNC_WRITES === 'true' && !!this.url;

  async send(body: unknown) {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.url,
        MessageBody: JSON.stringify(body),
      }),
    );
  }

  async receive(signal?: AbortSignal): Promise<Message[]> {
    const res = await this.sqs.send(
      new ReceiveMessageCommand({
        QueueUrl: this.url,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20, // long polling: fewer empty requests
      }),
      { abortSignal: signal },
    );
    return res.Messages ?? [];
  }

  async delete(receiptHandle: string) {
    await this.sqs.send(
      new DeleteMessageCommand({
        QueueUrl: this.url,
        ReceiptHandle: receiptHandle,
      }),
    );
  }
}
