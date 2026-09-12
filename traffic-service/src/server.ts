import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

const shutdown = async (): Promise<void> => {
  try {
    await app.close();
  } catch (error) {
    app.log.error(error);
  }
};

const start = async (): Promise<void> => {
  try {
    const port = Number(process.env.PORT ?? 7777);
    const host = "0.0.0.0";
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exitCode = 1;
    await shutdown();
  }
};

void start();
