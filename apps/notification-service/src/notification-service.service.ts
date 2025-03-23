import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationServiceService {
 
  private readonly logger = new Logger(NotificationServiceService.name);

  sendWelcomeEmail(email:string)
  {
    this.logger.log(`Ending welcome email to ${email}`);

    return {status:'success', message: `Welcome email sent to ${email}`};
  }

  
}
