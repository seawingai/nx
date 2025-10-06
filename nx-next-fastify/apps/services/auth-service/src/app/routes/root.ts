import { FastifyInstance } from 'fastify';
import { myLib } from '@seawingai/my-lib';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'Hello API: ' + myLib() };
  });
}
