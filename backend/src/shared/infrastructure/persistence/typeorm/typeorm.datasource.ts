import { DataSource } from 'typeorm';

import { getTypeOrmConfig } from './typeorm.config';

const dataSource = new DataSource(getTypeOrmConfig());

export default dataSource;
