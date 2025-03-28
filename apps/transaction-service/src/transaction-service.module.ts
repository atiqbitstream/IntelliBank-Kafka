import { Module } from '@nestjs/common';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaConnectionUtils } from '../kafka-connection.utils';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...KafkaConnectionUtils.createKafkaOptions({
          clientId: 'transaction-service-client',
          groupId: 'transaction-processing-group'
        })
      }
    ])
  ],
  controllers: [TransactionServiceController],
  providers: [TransactionServiceService],
})
export class TransactionServiceModule {}