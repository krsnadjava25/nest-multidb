import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LegacyTest, Test } from './data/data.entity';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'staging', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        DATABASE_HOST: Joi.string().hostname().required(),
        DATABASE_PORT: Joi.number().integer().positive().default(5432),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        LEGACY_DATABASE_HOST: Joi.string().hostname().required(),
        LEGACY_DATABASE_PORT: Joi.number().integer().positive().default(5432),
        LEGACY_DATABASE_PASSWORD: Joi.string().required(),
        LEGACY_DATABASE_NAME: Joi.string().required(),
      }),
      expandVariables: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): Partial<PostgresConnectionOptions> => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Test],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): Partial<PostgresConnectionOptions> => ({
        type: 'postgres',
        name: 'legacyConnection',
        host: configService.get<string>('LEGACY_DATABASE_HOST'),
        port: configService.get<number>('LEGACY_DATABASE_PORT'),
        username: configService.get<string>('LEGACY_DATABASE_USERNAME'),
        password: configService.get<string>('LEGACY_DATABASE_PASSWORD'),
        database: configService.get<string>('LEGACY_DATABASE_NAME'),
        entities: [LegacyTest],
        synchronize: true,
      }),
    }),
    DataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
