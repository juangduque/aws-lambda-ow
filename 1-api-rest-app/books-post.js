const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// const TABLE_NAME = 'books';

exports.handler = async (event, context) => {
    try {
        // Se crea el objeto a guardar que será modificado más adelante
        let requestBody = {};
        
        // Valida si se pasó body en la petición
        if(event.body){
            // Parsear el cuerpo de la solicitud POST debido a que llega en formato string
            requestBody = JSON.parse(event.body);
        }else{
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'No hay body' })
            };
        }
        
        // Se crea el item a guardar en la 
        const item = {
            TableName: TABLE_NAME,
            Item: requestBody
        };
        
        // Guardar el elemento en DynamoDB
        await dynamodb.put(item).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Elemento guardado exitosamente' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error interno' })
        };
    }
};



// Usando el AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "books";

export const handler = async (event, context) => {
    let body;
    let statusCode = 200;

    // Se crea el objeto a guardar que será modificado más adelante
    let requestBody = {};
    
    // Valida si se pasó body en la petición
    if(event.body){
        // Parsear el cuerpo de la solicitud POST debido a que llega en formato string
        requestBody = JSON.parse(event.body);
        // Si el valor ID no viene especificado se le asigna 
        if(!requestBody.ID){
            requestBody = {
                ...requestBody,
                ID: context.awsRequestId
            };
        }
    }else{
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No hay body' })
        };
    }

    try{
        await dynamo.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: requestBody,
            })
        );
        
        statusCode = 201;
        body = 'Documento ingresado correctamente';
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