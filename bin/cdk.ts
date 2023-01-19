import { App } from 'aws-cdk-lib';
import { CdkStarterStack } from '../lib/cs-cdk-stack';
import { cdk } from '../src/_config/config';

const app = new App();
new CdkStarterStack(app, 'cybersweep-cdk-stack', {
  stackName: 'cybersweep-cdk-stack',
  env: {
    region: cdk.region,
    account: cdk.account,
  },
});
