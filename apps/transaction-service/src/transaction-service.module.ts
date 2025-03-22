import { Module } from '@nestjs/common';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service-client',
            brokers: JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL),
          },
          consumer: {
            groupId: 'transaction-processing-group',
          },
        }
      }
    ])
  ],
  controllers: [TransactionServiceController],
  providers: [TransactionServiceService],
})
export class TransactionServiceModule {}
