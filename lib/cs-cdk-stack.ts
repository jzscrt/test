// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { control } from '../src/_config/config';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CDKContext } from '../src/dtos/cdk.dto';
import { LambdaStack } from '../src/_cdk/lambdaStack.cdk';

export class CyberSweepCdkStack extends Stack {
  constructor(scope: App, id: string, props: StackProps, context: CDKContext) {
    super(scope, id, props);

    const CSLambdaStack = LambdaStack(this, context);
    const csLambdaUser = CSLambdaStack.csLambdaUser;
    const csLambdaClient = CSLambdaStack.csLambdaClient;

    const API = new RestApi(this, 'Cybersweep-API', {
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

    const rootAPIResource = API.root.addResource('api').addResource(control.routesVer || 'v1');

    const userAPI = rootAPIResource.addResource('user');
    ['GET', 'POST', 'PATCH', 'DELETE'].forEach(method => {
      userAPI.addMethod(method, new LambdaIntegration(csLambdaUser));
    });

    const clientAPI = rootAPIResource.addResource('client');
    ['GET', 'POST', 'PATCH', 'DELETE'].forEach(method => {
      clientAPI.addMethod(method, new LambdaIntegration(csLambdaClient));
    });
  }
}
