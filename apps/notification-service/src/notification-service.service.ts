import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationServiceService {
 
  private readonly logger = new Logger(NotificationServiceService.name);

  sendWelcomeEmail(email:string)
  {
    this.logger.log(`Ending welcome email to ${email}`);

    return {status:'success', message: `Welcome email sent to ${email}`};
  }

  sendSuccessNotification(data: {
    transactionId:string;
    from:string;
    to:string;
    amount:number;
  })
  {
    const message = `Transaction ${data.transactionId} succeeded: $${data.amount} transferred from ${data.from} to ${data.to}`;
    this.logger.log(message);

    return {status: 'success', message};
  }

  sendFailureNotification(data: {
    transactionId:string;
    error:string;
    from:string;
    amount:number;
  })
  {
    const message = `Transaction ${data.transactionId} failed: ${data.error}. Attmepted amount: $${data.amount} from ${data.from}`;
    this.logger.warn(message);

    return {status: 'failedd', message}
  }

  
}
