import { Injectable, Logger } from '@nestjs/common';
import { error } from 'console';
import { map } from 'rxjs';

@Injectable()
export class TransactionServiceService {

 private readonly logger = new Logger(TransactionServiceService.name);

 private accounts = new Map<string,number>([
  ['cust-001',1000],
  ['cust-002', 500]
 ]);

 async processTransaction(transaction: {from:string; to:string; amount:number; transactionId:string})
 {
  this.logger.log(`processing Trnsaction ${transaction.transactionId}`);

  if(!this.accounts.has(transaction.from))
  {
    throw new Error(`Sender account ${transaction.from} not found`);
  }

  if(!this.accounts.has(transaction.to))
  {
    throw new Error(`Recipient account ${transaction.to} not found`)
  }

  if(this.accounts.get(transaction.from) < transaction.amount)
  {
    return {
      success: false,
      error: 'Insufficient funds',
      ...transaction
    }
  }

  try
  {
    this.accounts.set(transaction.from,
      this.accounts.get(transaction.from)-transaction.amount);
      this.accounts.set(transaction.to,
        this.accounts.get(transaction.to)+transaction.amount);
      
    return{
      success:true,
      message: 'Transaction completed successfully',
      ...transaction,
      newBalance: this.accounts.get(transaction.from),
    }
  }
  catch(error)
  {
    this.logger.error(`Transaction failed : ${error.message}`);
    return{
      success: false,
      error: error.message,
      ...transaction
    };
  }
 }


}
