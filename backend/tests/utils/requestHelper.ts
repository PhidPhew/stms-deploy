import { NextRequest } from 'next/server';

export function createNextRequest(method: string, url: string, body?: any, headers: Record<string, string> = {}) {
  const reqUrl = `http://localhost${url}`;
  const options: RequestInit = {
    method,
    headers: new Headers(headers),
  };
  
  if (body) {
    options.body = JSON.stringify(body);
    (options.headers as Headers).set('Content-Type', 'application/json');
  }

  return new NextRequest(reqUrl, options);
}
