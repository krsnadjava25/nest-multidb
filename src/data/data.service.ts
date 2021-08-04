import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { LegacyTest, Test } from './data.entity';

@Injectable()
export class DataService {
  private readonly legacyTestRepository: Repository<LegacyTest>;
  private readonly testRepository: Repository<Test>;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectConnection('legacyConnection')
    private readonly legacyConnection: Connection,
  ) {
    this.testRepository = this.connection.getRepository(Test);
    this.legacyTestRepository = this.legacyConnection.getRepository(LegacyTest);
  }

  async getData() {
    await this.testRepository.find();
    return await this.legacyTestRepository.find();
  }
}
