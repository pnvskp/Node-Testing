var AWS  = require('aws-sdk');

const bcrypt  = require('bcrypt');

AWS.config.update({
    region:'ap-south-1',
    endpoint:'http://localhost:8000'
});

// var dynamodb  = new AWS.DynamoDB();

var ddb = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: 'Auth',
    KeySchema:[
        {AttributeName:'pk',KeyType:'HASH'},
        {AttributeName:'id',KeyType:'RANGE'}
    ],
    AttributeDefinitions:[
        {AttributeName:'pk',AttributeType:'S'},
        {AttributeName:'id',AttributeType:'S'}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 15,
        WriteCapacityUnits: 10,
      },
};




//To create Auth Table
// dynamodb.createTable(params, (err,data) =>{
//     if(err){
//         console.log('An error occured while creating table',JSON.stringify(err,data,2));
//     }
//     else{
//         console.log('Created Table. The JSON of the table: ',JSON.stringify(data,null,2));
//     }
// })

// To add User to Auth Table
const addUser = user => new Promise((resolve,reject)=>{
    if(!user.id) return reject(new Error('User ID is required'));
    if(!user.password) return (new Error('Password is Required'));
    let hashedpassword = bcrypt.hashSync(user.password,10);

    var dataParams = {
        TableName: 'Auth',
        Item:{
            'pk':'user',
            'id':user.id,
        }
    }
    dataParams.Item.password = hashedpassword;

ddb.put(dataParams, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", data);
    }
});
})


const getUserById = user => new Promise((resolve,reject) =>{
    console.log('User Data:',user.id);
    if(!user.id) return reject(new Error('User ID is required'));
    const params = {
        TableName : "Auth",
        Key:{
            'pk':'user',
            'id':user.id,
        }
    }
    
    ddb.get(params, (err,result) =>{
        // console.log('Result:',result);
        if(err) return reject(err);
        const item = result.Item;
        if(!item) return resolve(null);
        return resolve(item);
    });

    return 0;

})

module.exports = {getUserById};
