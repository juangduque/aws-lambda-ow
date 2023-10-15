import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient());

const TABLE_NAME = "books";

export const handler = async (event) => {
    let statusCode = 200;
    let body;
    let requestBody = {};
    let id = '';
  
    // Se valida si se pasó body en la petición
    if(event.body){
        // Parsear el cuerpo de la solicitud PUT debido a que llega en formato string
        requestBody = JSON.parse(event.body);
    }else{
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No hay body' })
        };
    }
    
    // Se valida si se ha pasado el parámetro id
    if(event.pathParameters.id){
        id = event.pathParameters.id;
    }else{
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No se ha pasado id' })
        };
    }
    
    const params = {
        TableName: TABLE_NAME,
        Key: { ID: id },
        UpdateExpression: "SET #title = :newTitle, #author = :newAuthor, #publicationYear = :newPublicationYear, #isbn = :newIsbn, #genre =  :newGenre, #publisher = :newPublisher, #price = :newPrice",
        ExpressionAttributeNames: {
          "#title": "title",
          "#author": "author",
          "#publicationYear": "publicationYear",
          "#isbn": "isbn",
          "#genre": "genre",
          "#publisher": "publisher",
          "#price": "price",
        },
        ExpressionAttributeValues: {
          ":newTitle": requestBody.title,
          ":newAuthor": requestBody.author,
          ":newPublicationYear": requestBody.publicationYear,
          ":newIsbn": requestBody.isbn,
          ":newGenre": requestBody.genre,
          ":newPublisher": requestBody.publisher,
          ":newPrice": requestBody.price,
        },
        ReturnValues: "ALL_NEW",
    };
  
    try {
        const result = await dynamo.send(new UpdateCommand(params));
        statusCode = 200;
        body = { message: "Documento actualizado correctamente", result: result.Attributes };
    } catch (error) {
        statusCode = 400;
        body = error.message;
    }finally {
        body = JSON.stringify(body);
    }
    
    return{
        statusCode,
        body,
        headers: {
            "Content-Type": "application/json",
        }
    };
};