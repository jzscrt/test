import { Stack } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export function LambdaStack(stack: Stack) {
  const csLambdaUser = new NodejsFunction(stack, 'CyberSweepLambdaUser', {
    functionName: 'CyberSweepLambdaUser',
    runtime: Runtime.NODEJS_16_X,
    memorySize: 1024,
    timeout: Duration.minutes(3),
    handler: 'main',
    entry: join(__dirname, '../../src/_lambdas/users.lambda.ts'),
    bundling: {
      externalModules: ['mock-aws-s3', 'nock'], //added because of this --> node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:43:28
    },
  });

  const csLambdaClient = new NodejsFunction(stack, 'CyberSweepLambdaClient', {
    functionName: 'CyberSweepLambdaClient',
    runtime: Runtime.NODEJS_16_X,
    memorySize: 1024,
    timeout: Duration.minutes(3),
    handler: 'main',
    entry: join(__dirname, '../../src/_lambdas/client.lambda.ts'),
    bundling: {
      externalModules: ['mock-aws-s3', 'nock'], //added because of this --> node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:43:28
    },
  });

  return {
    csLambdaUser,
    csLambdaClient,
  };
}
