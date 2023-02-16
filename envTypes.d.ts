export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URI: string;
      PORT: number;
      SECRET: string;
    }
  }
}
