import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaConnectionUtils } from '../kafka-connection.utils';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...KafkaConnectionUtils.createKafkaOptions({
          clientId: 'notification-service-client',
          groupId: 'notification-group'
        })
      }
    ])
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}