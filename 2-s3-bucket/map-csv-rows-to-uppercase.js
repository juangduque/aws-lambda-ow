import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3();

export const handler = async (event) => {
    // Obtiene el nombre del bucket y el nombre del archivo
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        const objectData = await s3.getObject(params); // Obtiene el objeto del bucket
        const csvData = await objectData.Body.transformToString(); // Transforma la data del objeto a string
        const rows = csvData.split('\r\n');
        rows.map((row) => {
            console.log(row.toUpperCase());
        });
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};