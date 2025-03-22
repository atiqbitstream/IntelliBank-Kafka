import { Module } from '@nestjs/common';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { ClientsModule, Transport} from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'customer-service-producer',
            brokers: JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL),
          },
        }
      }
    ])
  ],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}
