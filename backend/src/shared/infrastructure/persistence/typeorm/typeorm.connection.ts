import { ConsoleLogger } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

import { getTypeOrmConfig } from './typeorm.config';

export class TypeOrmConnection {
  private static instance: TypeOrmConnection;
  private dataSource: DataSource;
  private readonly logger = new ConsoleLogger(TypeOrmConnection.name);
  private isConnected = false;

  private constructor() {
    this.dataSource = new DataSource(getTypeOrmConfig());
  }

  public static getInstance(): TypeOrmConnection {
    if (!TypeOrmConnection.instance) {
      TypeOrmConnection.instance = new TypeOrmConnection();
    }
    return TypeOrmConnection.instance;
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.dataSource.initialize();
        this.isConnected = true;
        this.logger.log('Database connection established successfully');
      } catch (error) {
        this.logger.error(`Error connecting to database: ${(error as Error).message}`, (error as Error).stack);
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.dataSource.destroy();
        this.isConnected = false;
        this.logger.log('Database connection closed successfully');
      } catch (error) {
        this.logger.error(`Error disconnecting from database: ${(error as Error).message}`, (error as Error).stack);
        throw error;
      }
    }
  }

  public getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
    if (!this.isConnected) {
      throw new Error('Database connection not established');
    }
    return this.dataSource.getRepository(entity);
  }

  public getDataSource(): DataSource {
    if (!this.isConnected) {
      throw new Error('Database connection not established');
    }
    return this.dataSource;
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}
