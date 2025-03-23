import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { TransactionServiceService } from './transaction-service.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class TransactionServiceController {

  private readonly logger = new Logger(TransactionServiceController.name)

  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient:ClientKafka,
  private readonly transactionService: TransactionServiceService
) 
{}

  @Post('transactions')
  initiateTransaction(@Body() data: {from:string; to:string; amount: number, transactionId:string})
  {
    this.kafkaClient.emit('transaction.requested',data);
  }

  @MessagePattern('transaction.requested')
  async processTransaction(@Payload() data: {
    from:string,
    to:string,
    amount:number,
    transactionId: string
  })
  {
    this.logger.log(`Received transaction request: ${JSON.stringify(data)}`);

    try{
      const result = await this.transactionService.processTransaction(data);

      this.kafkaClient.emit('transaction.processed',{
        key:data.transactionId,
        value:result,
      });

      if(!result.success)
      {
        this.kafkaClient.emit('transaction failed',{
          key: data.transactionId,
          value: result
        });
      }
    }catch(error){
      this.logger.error(`Transaction processing error: ${error.message}`);
      this.kafkaClient.emit('transaction error',{
        key: data.transactionId,
        value: {
          ...data,
          error:error.message,
        }
      })
    }
  }
}
