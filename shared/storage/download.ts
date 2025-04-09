import { minioClient, bucketName } from './index';

export default async function download(objectName: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    minioClient.getObject(bucketName, objectName, (err: any, stream: any) => {
      if (err) {
        console.error('❌ Error downloading file:', err);
        return reject(err);
      }
      // Initialize an array to store stream chunks
      const chunks: any[] = [];
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      stream.on('end', () => {
        console.log(`✅ File downloaded successfully from "${objectName}"`);
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', (error: any) => {
        console.error('❌ Error reading stream:', error);
        reject(error);
      });
    });
  });
}
