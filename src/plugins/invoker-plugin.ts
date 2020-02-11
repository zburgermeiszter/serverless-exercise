'use strict';

import Serverless from 'serverless';
import { Lambda } from 'aws-sdk';

const invokeLambda = async ({ FunctionName }: { FunctionName: string }) => {
  const params = {
    FunctionName,
    InvocationType: 'RequestResponse',
    Payload: ''
  };

  const results = await new Lambda().invoke(params).promise();
  console.log(results);
};

class InvokerPlugin {
  serverless: Serverless;
  options: Serverless.Options;
  hooks: { [key: string]: Function };

  constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': () =>
        invokeLambda({
          FunctionName: this.serverless.service.custom['lambdaName']
        })
    };
  }
}

module.exports = InvokerPlugin;
