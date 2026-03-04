/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SEPAY_WEBHOOK_API_KEY?: string;
    }
  }
}

export interface CloudflareEnv {
  VOCAB_PAYMENTS: KVNamespace;
}

export {};
