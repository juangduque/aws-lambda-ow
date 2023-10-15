import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3();

export const handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name; // Obtiene el nombre del bucket
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')); // obtiene el nombre del archivo
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        const objectData = await s3.getObject(params); // Obtiene el objeto del bucket
        const csvData = await objectData.Body.transformToString(); // Transforma la data del objeto a string
        const rows = csvData.split('\r\n'); // Genera un arreglo con cada una de las filas del csv 
        
        // A continuación, transforma los datos del archivo csv a formato json
        const header = rows[0].split(','); // Guarda la primera fila, la de encabezado

        const jsonData = [];
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            const item = {};
        
            for (let j = 0; j < header.length; j++) {
                item[header[j]] = row[j];
            }
        
            jsonData.push(item);
        }
        
        console.log(JSON.stringify(jsonData, null, 2));
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};