import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig: config.IConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME ?? dbConfig.get('host'),
  port: Number(process.env.RDS_PORT) ?? dbConfig.get('port'),
  username: process.env.RDS_USERNAME ?? dbConfig.get('username'),
  password: process.env.RDS_PASSWORD ?? dbConfig.get('password'),
  database: process.env.RDS_DB_NAME ?? dbConfig.get('database'),
  autoLoadEntities: true,
  synchronize: Boolean(process.env.TYPEORM_SYNC) ?? dbConfig.get('synchronize'),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
