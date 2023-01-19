import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { control } from '../src/_config/config';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class CdkStarterStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersLambdaCS = new NodejsFunction(this, 'usersCtrl-lambda-cs', {
      memorySize: 1024,
      timeout: Duration.minutes(3),
      runtime: Runtime.NODEJS_16_X,
      handler: 'main',
      entry: join(__dirname, '../src/_lambdas/users.lambda.ts'),
      projectRoot: join(__dirname, '../'),
    });

    const api = new RestApi(this, 'apigateway-cb', {
      description: 'CyberSweep Api Gateway built with CDK',
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    });

    const rootAPI = api.root.addResource('api').addResource(control.routesVer || 'v1');
    const usersAPI = rootAPI.addResource('users');
    ['GET', 'POST', 'PATCH', 'DELETE'].forEach(method => {
      usersAPI.addMethod(method, new LambdaIntegration(usersLambdaCS));
    });
  }
}
