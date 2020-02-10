import { Marshaller } from '@aws/dynamodb-auto-marshaller';
import { APIGatewayEvent } from 'aws-lambda';
import { S3, DynamoDB } from 'aws-sdk';
import ytdl from 'ytdl-core';

export const getEnv = () => {
  const bucket = process.env.uploadsBucketName;
  const videoIDsFile = process.env.videoIDsFile;
  const tableName = process.env.tableName;

  if (!bucket) throw new Error('Missing bucket name');
  if (!videoIDsFile) throw new Error('Missing Video IDs file');
  if (!tableName) throw new Error('Missing DynamoDB table name');

  return { bucket, videoIDsFile, tableName };
};

const getYoutubeInfo = async (videoID: string) => ytdl.getInfo(videoID);

export const getVideoIDsFromS3 = async ({
  bucket: Bucket,
  file: Key
}: {
  bucket: string;
  file: string;
}) =>
  (await new S3().getObject({ Bucket, Key }).promise()).Body?.toString(
    'utf-8'
  )?.split('\n') ?? [];

export const getVideoInfos = (videoIDs: string[]) =>
  Promise.all(videoIDs.map(getYoutubeInfo));

export const writeVideoInfosToDynamoDB = ({
  videoInfos,
  table: table
}: {
  videoInfos: ytdl.videoInfo[];
  table: string;
}) => {
  const marshaller = new Marshaller();

  const params = {
    RequestItems: {
      [table]: videoInfos.map(info => {
        return {
          PutRequest: {
            Item: marshaller.marshallItem({
              ...info.player_response.videoDetails,
              fetchedAt: Math.floor(Date.now() / 1000)
            })
          }
        };
      })
    }
  };

  return new DynamoDB({ apiVersion: '2012-08-10' })
    .batchWriteItem(params)
    .promise();
};

export const requestWrapper = (wrapped: () => Promise<{}>) => async (
  event: APIGatewayEvent
) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: await wrapped()
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Something went wrong!'
      })
    };
  }
};
