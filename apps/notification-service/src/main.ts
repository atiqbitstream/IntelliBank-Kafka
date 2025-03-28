import { KafkaConnectionUtils } from './../kafka-connection.utils';
import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';


async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  
  const kafkaConfig = {
    clientId: 'notification-service-client',
    groupId: 'notification-group'
  };

  const kafkaOptions = KafkaConnectionUtils.createKafkaOptions(kafkaConfig);
  
  // Log connection details
  KafkaConnectionUtils.logKafkaConnectionDetails(
    kafkaConfig.clientId, 
    kafkaOptions.options.client.brokers as string[]
  );

  // Connect the Kafka microservice
  app.connectMicroservice(kafkaOptions);

  // Start both the HTTP server and microservices
  await app.startAllMicroservices();

  const port = process.env.PORT || 3001;

  await app.listen(port, '0.0.0.0');
}
bootstrap();