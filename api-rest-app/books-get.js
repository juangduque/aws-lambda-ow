import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "books";

export const handler = async (event) => {
    let id = '';
    let body;
    let statusCode = 200;

    // Se valida si se ha pasado el parámetro id
    if(event.pathParameters.id){
        id = event.pathParameters.id;
    }else{
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No se ha pasado id' })
        };
    }
    
    try{
        body = await dynamo.send(
          new GetCommand({
            TableName: TABLE_NAME,
            Key: {
              ID: id,
            },
          })
        );
        body = body.Item;
    }catch(error){
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
