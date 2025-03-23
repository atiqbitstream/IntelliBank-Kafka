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

  @MessagePattern('transaction.processed')
  handleTransaction(@Payload() data:{
    success: boolean;
    transactionId:string;
    from:string;
    to:string;
    amount:number;
    error: string;
  })
  {
    if(data.success)
    {
      return this.notificationService.sendSuccessNotification({
        transactionId:data.transactionId,
        from: data.from,
        to:data.to,
        amount:data.amount
      });
    }else{
        return this.notificationService
      }
    }
  }

  
}
