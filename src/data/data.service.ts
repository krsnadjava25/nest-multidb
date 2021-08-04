import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegacyTest, Test } from './data.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(LegacyTest, 'legacyConnection')
    private readonly legacyTestRepository: Repository<LegacyTest>,
  ) {}

  async getData() {
    await this.testRepository.find();
    return await this.legacyTestRepository.find();
  }
}
