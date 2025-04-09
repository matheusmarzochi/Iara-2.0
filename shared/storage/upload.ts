import { minioClient, bucketName } from './index';

export default async function upload(filePath: string, objectName: string): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(`Bucket "${bucketName}" does not exist. Creating it...`);
      await minioClient.makeBucket(bucketName);
    }
    await minioClient.fPutObject(bucketName, objectName, filePath);
    console.log(`✅ File uploaded successfully to "${bucketName}/${objectName}"`);
  } catch (err) {
    console.error('❌ Error uploading file:', err);
    throw err;
  }
}
