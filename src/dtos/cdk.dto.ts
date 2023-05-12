export type CDKContext = {
  appName: string;
  region: string;
};

export type LambdaDefinition = {
  name: string;
  memoryMB?: number;
  timeoutMins?: number;
  path: string;
  bundling?: any;
  environment?: {
    [key: string]: string;
  };
};
