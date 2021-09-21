var AWS   =   require('aws-sdk');

AWS.config.update({
    region:"ap-south-1",
    endpoint:"http://localhost:8000"
});

var docClient  = new AWS.DynamoDB.DocumentClient();

var table = "Movies";

var year = 2010;


var params = {
    TableName: table,
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames:{
        "#yr" :"year"
    },
    ExpressionAttributeValues:{
        ":yyyy" : 2012
    }
};

docClient.query(params, (err,data) =>{
    if(err){
        console.log("Unable to Query. Error:", JSON.stringify(err,null,2));
    }
    else{
        console.log("Query Succeded");
        data.Items.forEach(function(item) {
            console.log(" -", item.year + ": " + item.title);
        });
    }
})