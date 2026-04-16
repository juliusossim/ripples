import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env['DATABASE_URL'] ?? 'postgresql://ripples:ripples@localhost:5432/ripples',
  },
  migrations: {
    path: 'prisma/migrations',
  },
});
