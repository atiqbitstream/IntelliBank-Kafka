import { Module } from '@nestjs/common';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaConnectionUtils } from '../kafka-connection.utils';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...KafkaConnectionUtils.createKafkaOptions({
          clientId: 'customer-service-producer',
          groupId: 'customer-service-group',
        })
      }
    ])
  ],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}