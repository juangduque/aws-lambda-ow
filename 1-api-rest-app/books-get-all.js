// Con la versión2.0 del AWS SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'books'; // Replace with your DynamoDB table name

exports.handler = async (event, context) => {
    try {
        // Scan the DynamoDB table to get all items
        const params = {
            TableName: tableName,
        };

        const data = await dynamodb.scan(params).promise();

        // Extract the items from the response
        const books = data.Items;

        return {
            statusCode: 200,
            body: JSON.stringify(books),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message),
        };
    }
};


// Con la versión 3.0 del AWS SDK
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "books";

export const handler = async (event) => {
    let body;
    let statusCode = 200;

    try{
        body = await dynamo.send(
            new ScanCommand({ TableName: TABLE_NAME })
        );
        body = body.Items;
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
