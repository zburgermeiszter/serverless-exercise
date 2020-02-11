# Serverless Exercise

## Task

Build a serverless framework (serverless.com) deployment that creates a Lambda, an S3 bucket, and a Dynamo DB table and uploads a file to your bucket. Then, write a plugin that invokes the Lambda after the deployment, extracts data from the file in S3 and inserts that data into DynamoDB. Be creative. Show off. Make it interesting.

## Preparation

Set `AWS_REGION` in your environment.

`export AWS_REGION=eu-west-2` or add it to your `.bashrc` file.

Configure `service`, `app` and `org` in `serverless.yml`.

Install `serverless` using `npm install -g serverless`.

## Deployment

To deploy the stack to AWS run `npm run deploy`

It will create the necessary resources, and also invoke the Lambda function which will process a file from S3 which contains YouTube video IDs, and then saves the video info to a DynamoDB table.

## Cleanup

To remove all the resources created by this script run `npm run remove`.
