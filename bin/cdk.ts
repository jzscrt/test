import { App } from 'aws-cdk-lib';
import { CdkStarterStack } from '../lib/cs-cdk-stack';
import { CDK_DEFAULT_REGION, CDK_DEFAULT_ACCOUNT } from '../src/_config';

const app = new App();
new CdkStarterStack(app, 'cdk-stack', {
  stackName: 'cdk-stack',
  env: {
    region: CDK_DEFAULT_REGION,
    account: CDK_DEFAULT_ACCOUNT,
  },
});
