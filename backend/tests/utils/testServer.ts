import { createServer } from 'http';
import { NextRequest } from 'next/server';
import request from 'supertest';

export const createTestServer = (handler: Function, routeParams: Record<string, string> = {}) => {
  const server = createServer(async (req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      const url = `http://localhost${req.url}`;
      
      const init: RequestInit = {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: ['GET', 'HEAD'].includes(req.method || 'GET') ? null : body,
      };

      const nextReq = new NextRequest(url, init);
      
      try {
        // Mock Next.js dynamic params as Promises
        const params = Promise.resolve(routeParams);
        const nextRes = await handler(nextReq, { params });
        res.statusCode = nextRes.status;
        nextRes.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        const resBody = await nextRes.text();
        res.end(resBody);
      } catch (err: any) {
        res.statusCode = 500;
        res.end(err.message);
      }
    });
  });

  return request(server);
};
