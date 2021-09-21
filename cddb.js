var AWS  =  require('aws-sdk');

AWS.config.update({
    region:'ap-south-1',
    endpoint:'http://localhost:8000'
});

var docClient = new AWS.DynamoDB.DocumentClient();