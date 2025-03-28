import { KafkaConnectionUtils } from './../kafka-connection.utils';
import { NestFactory } from '@nestjs/core';
import { CustomerServiceModule } from './customer-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CustomerServiceModule);
  
  const kafkaConfig = {
    clientId: 'customer-service-client',
    groupId: 'customer-service-group'
  };

  const kafkaOptions = KafkaConnectionUtils.createKafkaOptions(kafkaConfig);
  
  // Log connection details
  KafkaConnectionUtils.logKafkaConnectionDetails(
    kafkaConfig.clientId, 
    kafkaOptions.options.client.brokers as string[] // Additional type assertion
  );

  // Connect the Kafka microservice
  app.connectMicroservice(kafkaOptions);

  // Start both the HTTP server and microservices
  await app.startAllMicroservices();

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();