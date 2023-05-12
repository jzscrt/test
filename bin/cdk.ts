#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { CyberSweepCdkStack } from '../lib/cs-cdk-stack';
import { CDKContext } from '../src/dtos/cdk.dto';
import { cdk } from '../src/_config/config';
import * as awscdk from 'aws-cdk-lib';

export const getContext = async (app: awscdk.App): Promise<CDKContext> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Outside the context of a construct, you can access the context variable from the app object, like this:
      const globals = app.node.tryGetContext('globals');
      return resolve({ ...globals });
    } catch (error) {
      console.error(error);
      return reject();
    }
  });
};

const createStacks = async () => {
  try {
    const app = new App();
    const context = await getContext(app);
    const cdkProps = {
      stackName: 'cybersweep-cdk-stack',
      description: 'This the CDK Stack for CyberSweep',
      env: {
        region: cdk.region,
        account: cdk.account,
      },
    };

    new CyberSweepCdkStack(app, 'cybersweep-cdk-stack', cdkProps, context);
  } catch (error) {
    console.error(error);
  }
};

createStacks();

// import { App } from 'aws-cdk-lib';
// import { CdkStarterStack } from '../lib/cs-cdk-stack';
// import { cdk } from '../src/_config/config';
// import * as cdk from 'aws-cdk-lib';

// const app = new App();
// new CdkStarterStack(app, 'cybersweep-cdk-stack', {
//   stackName: 'cybersweep-cdk-stack',
//   env: {
//     region: cdk.region,
//     account: cdk.account,
//   },
// });
