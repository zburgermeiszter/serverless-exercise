'use strict';
import 'source-map-support/register';
import {
  getEnv,
  getVideoIDsFromS3,
  getVideoInfos,
  requestWrapper,
  writeVideoInfosToDynamoDB
} from './helpers';

const { bucket, videoIDsFile, tableName } = getEnv();

export const processVideoIDs = requestWrapper(async () => {
  const ids = await getVideoIDsFromS3({ bucket, file: videoIDsFile });
  const videoInfos = await getVideoInfos(ids);
  await writeVideoInfosToDynamoDB({ videoInfos, table: tableName });
  return { processed: videoInfos.length };
});
