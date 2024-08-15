import { OnModuleInit } from '@nestjs/common';
import { Channel, connect, Connection } from 'amqplib';
import { v4 as uuid } from 'uuid';

const queueNames: string[] = ['order', 'report'];

export class RabbitmqService implements OnModuleInit {
  protected connection: Connection;
  protected channel: Channel;

  constructor() {}

  async onModuleInit() {
    this.connection = await connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await Promise.allSettled(
      queueNames.map((name) =>
        this.channel.assertQueue(name, {
          durable: false,
        }),
      ),
    );
  }

  async sendMessage(queueName: string, data: any): Promise<any> {
    const receiveQueue = await this.channel.assertQueue('', {
      exclusive: true,
    });

    const correlationId = uuid();
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      correlationId,
      replyTo: receiveQueue.queue,
    });

    const responsePromise = new Promise(async (resolve, reject) => {
      var consumer = await this.channel.consume(
        receiveQueue.queue,
        async (msg) => {
          if (msg?.properties?.correlationId === correlationId) {
            resolve(JSON.parse(msg.content.toString()));
            this.channel.ack(msg);

            setTimeout(() => {
              this.channel.cancel(consumer.consumerTag);
              this.channel.deleteQueue(receiveQueue.queue);
            }, 5000);
          }
        },
        { noAck: false },
      );
    });

    return responsePromise;
  }
}
