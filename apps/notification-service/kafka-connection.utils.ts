import { Logger } from '@nestjs/common';
import { Transport, KafkaOptions } from '@nestjs/microservices';

export interface KafkaConnectionConfig {
  clientId: string;
  groupId: string;
  brokers?: string[];
}

export class KafkaConnectionUtils {
  private static readonly logger = new Logger(KafkaConnectionUtils.name);

  static parseKafkaBrokers(brokersEnv?: string): string[] {
    if (!brokersEnv) {
      this.logger.error('No Kafka brokers environment variable found');
      return [];
    }
    
    try {
      // First, try parsing as JSON
      const parsedBrokers = JSON.parse(brokersEnv);
      
      if (Array.isArray(parsedBrokers) && parsedBrokers.length > 0) {
        this.logger.log(`Parsed ${parsedBrokers.length} Kafka brokers from JSON`);
        return parsedBrokers;
      }
      
      throw new Error('Invalid broker format');
    } catch (jsonError) {
      // Fallback to comma-separated parsing
      const commaSeparatedBrokers = brokersEnv.split(',')
        .map(broker => broker.trim())
        .filter(broker => broker.length > 0);
      
      if (commaSeparatedBrokers.length > 0) {
        this.logger.log(`Parsed ${commaSeparatedBrokers.length} Kafka brokers from comma-separated string`);
        return commaSeparatedBrokers;
      }
      
      this.logger.error('Could not parse Kafka brokers');
      return [];
    }
  }

  static createKafkaOptions(config: KafkaConnectionConfig): KafkaOptions {
    const brokers = this.parseKafkaBrokers(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL);
    
    if (brokers.length === 0) {
      this.logger.error('No Kafka brokers available. Check your configuration.');
    }

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: config.clientId,
          brokers: brokers as string[], // Type assertion here
          ssl: true,
          sasl: {
            mechanism: 'plain',
            username: process.env.EVENT_STREAMS_USER || '',
            password: process.env.EVENT_STREAMS_PASSWORD || '',
          },
          connectionTimeout: 10000,
          authenticationTimeout: 10000,
        },
        consumer: {
          groupId: config.groupId,
          sessionTimeout: 30000,
          heartbeatInterval: 10000,
          allowAutoTopicCreation: true,
          maxWaitTimeInMs: 100,
          retry: {
            initialRetryTime: 100,
            retries: 3,
          },
        },
        producer: {
          idempotent:true,
          retry: {
            initialRetryTime: 100,
            retries: 3,
          },
        },
      },
    };
  }

  static logKafkaConnectionDetails(clientId: string, brokers: string[]) {
    this.logger.log(`Kafka Connection Details for ${clientId}:`);
    this.logger.log(`Brokers: ${brokers.join(', ')}`);
    this.logger.log(`User: ${process.env.EVENT_STREAMS_USER ? 'Provided' : 'Not Provided'}`);
    this.logger.log(`SSL: Enabled`);
  }
}