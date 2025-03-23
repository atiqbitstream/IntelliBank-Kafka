import { Controller, Get, Logger } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationServiceController {

  private readonly logger = new Logger(NotificationServiceController.name);

  constructor(private readonly notificationService: NotificationServiceService) {}

  @MessagePattern('customer.created')
  handleCustomerCreated(@Payload() data : {email:string})
  {
     this.logger.log(`New Customer created: ${data.email}`);
     return this.notificationService.sendWelcomeEmail(data.email);
  }

  
}
