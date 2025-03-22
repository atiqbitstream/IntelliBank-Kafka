import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification-service-client',
            brokers: JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL),
          },
          consumer: {
            groupId: 'notification-group',
          },
        }
      }
    ])
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
