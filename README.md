# Exercise

Build a serverless framework (serverless.com) deployment that creates a Lambda, an S3 bucket, and a
Dynamo DB table and uploads a file to your bucket. Then, write a plugin that invokes the Lambda after
the deployment, extracts data from the file in S3 and inserts that data into DynamoDB. Be creative. Show
off. Make it interesting.

# Preparation

Set `AWS_REGION` in your environment.

`export AWS_REGION=eu-west-2` or add it to your `.bashrc` file.
