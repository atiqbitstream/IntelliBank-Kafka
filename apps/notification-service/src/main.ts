import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  // Parse brokers correctly
  let brokers = [];
  try {
    if (process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL) {
      brokers = JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL);
    }
    console.log('Kafka brokers:', brokers);
  } catch (error) {
    console.error('Error parsing Kafka brokers:', error);
    brokers = process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL?.split(',') || [];
  }

  // Connect the Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification-service-client',
        brokers: brokers,
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: process.env.EVENT_STREAMS_USER || '',
          password: process.env.EVENT_STREAMS_PASSWORD || '',
        }
      },
      consumer: {
        groupId: 'notification-group',
        sessionTimeout: 30000,
        heartbeatInterval: 10000,
        allowAutoTopicCreation: true
      },
    }
  });

  // Start both the HTTP server and microservices
  await app.startAllMicroservices();
  await app.listen(3001, '0.0.0.0');
}
bootstrap();

