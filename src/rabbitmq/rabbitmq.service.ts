import { OnModuleInit } from '@nestjs/common';
import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';
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

    const responsePromise = new Promise(async (resolve) => {
      this.channel.consume(
        receiveQueue.queue,
        async (msg) => {
          if (msg.properties.correlationId === correlationId) {
            resolve(msg);
          }
        },
        { noAck: false },
      );
    }).then((msg: ConsumeMessage) => {
      this.channel.ack(msg);
      this.channel.cancel(msg.fields.consumerTag);
      this.channel.deleteQueue(receiveQueue.queue);

      return JSON.parse(msg.content.toString());
    });

    return responsePromise;
  }
}
