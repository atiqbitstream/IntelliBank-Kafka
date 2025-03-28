import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';

@Controller('customer')
export class CustomerServiceController {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient:ClientKafka) {}

  private readonly logger = new Logger(CustomerServiceController.name);


@Post()
createCustomer(@Body() data: {id:string;name:string;email:string})
{
  this.logger.log(`Emitting customer created event : ${JSON.stringify(data)}`);
  this.kafkaClient.emit('customer.created',{
    key: data.id,
    value:data
  });
  return {message: 'customer created', data}
}
}
