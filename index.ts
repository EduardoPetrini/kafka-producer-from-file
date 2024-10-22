import dotenv from 'dotenv';
dotenv.config();

import { Kafka, KafkaConfig } from 'kafkajs';
import { logInfo } from './utils';
import fs from 'fs/promises';

const topic = process.argv[2] || process.env.KAFKA_TOPIC;
const brokers = process.env.KAFKA_BROKERS?.split(',');
const clientId = process.env.KAFKA_CLIENT_ID;
const groupId = process.env.KAFKA_GROUP_ID;
const fileInput = process.env.MESSAGES_FILE_INPUT;

if (!topic || !brokers?.length || !clientId || !groupId || !fileInput) {
  logInfo('Missing required parameters:\n', `\ttopic: ${!!topic}\n\tbrokers: ${!!brokers?.length}\n\tclientId: ${!!clientId}\n\tgroupId: ${!!groupId}\n\tgroupId: ${!!fileInput}`);

  process.exit(1);
}

const config: KafkaConfig = {
  brokers,
  clientId,
};

(async () => {
  logInfo('Topic to pull:', topic);
  const kafka = new Kafka(config);

  logInfo('Configuring kafka producer...');

  const producer = kafka.producer();

  await producer.connect();

  const messages = (await fs.readFile(fileInput)).toString().split('\n');
  for (let msg of messages) {
    if (!msg) {
      continue;
    }
    const js = JSON.parse(msg);
    logInfo('pushing message', js.partition, js.offset);
    await producer.send({
      topic,
      messages: [{ key: js.key, value: js.value }],
    });
  }
})();
