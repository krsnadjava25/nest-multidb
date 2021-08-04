import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegacyTest, Test } from './data.entity';
import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test]),
    TypeOrmModule.forFeature([LegacyTest], 'legacyConnection'),
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
