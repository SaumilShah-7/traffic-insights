import { FastifyInstance } from 'fastify';

const registerRoutes = (app: FastifyInstance): void => {
  app.get('/health', () => ({ status: 'ok' }));
};

export { registerRoutes };
