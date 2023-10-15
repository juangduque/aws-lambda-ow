import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "books";

export const handler = async (event) => {
    let statusCode = 200;
    let body = "";
    let id = "";
  
    // Se valida si se ha pasado el parámetro id
    if (event.pathParameters.id) {
        id = event.pathParameters.id;
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "No se ha pasado id" }),
        };
    }
  
    try {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                ID: id,
            },
        });
    
        const response = await docClient.send(command);
        if (!response) {
            statusCode = 404;
            body = 'Documento no encontrado';
        } else {
            body = 'Documento eliminado correctamente';
            statusCode = response.$metadata.httpStatusCode
        }
    } catch (error) {
        statusCode = 400;
        body = error.message;
    } finally {
        body = JSON.stringify(body);
    }
  
    return {
        statusCode,
        body,
        headers: {
            "Content-Type": "application/json",
        },
    };
};