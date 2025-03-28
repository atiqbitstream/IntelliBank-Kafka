import { KafkaConnectionUtils } from './../kafka-connection.utils';
import { NestFactory } from '@nestjs/core';
import { TransactionServiceModule } from './transaction-service.module';


async function bootstrap() {
  const app = await NestFactory.create(TransactionServiceModule);
  
  const kafkaConfig = {
    clientId: 'transaction-service-client',
    groupId: 'transaction-processing-group'
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

  const port = process.env.PORT || 3002;

  await app.listen(port, '0.0.0.0');
}
bootstrap();