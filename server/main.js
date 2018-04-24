var express = require('express');
var bodyParser = require('body-parser');
var SQL = require('./mysqlFunctions.js');
var app = express();
var port = 8080;

app.listen(port);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var responseHeaders = {  
    "access-control-allow-origin": "http://localhost:8080",
    "Content-Type": "application/json"
};

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

console.log('Server started! At http://localhost:' + port);

app.post('/login', function(req,res){
	console.log ("webAPI -- /login");
    var username = req.body.username;
    var password = req.body.password;
	SQL.Login(username,password,function(err,result){
		res.send(result);
		res.end();
	});
});

app.post('/get-form-by-id', function(req,res){
	console.log ("webAPI -- /get-form-by-id");
    var id = req.body.id;
	SQL.getFormByID(id,function(err,result){
		res.send(result);
		res.end();
	});
});

app.get('/get-form', function(req,res){
	console.log ("webAPI -- /get-form");
	SQL.getForm(function(err,result){
		res.send(result);
		res.end();
	});
});

app.post('/student-submit-form', function(req,res){
	console.log ("webAPI -- /student-submit-form");
    var id = req.body.id;
    var point1 = req.body.point1;
    var point2 = req.body.point2;
    var point3 = req.body.point3;
	SQL.studentSubmitForm(id,point1,point2,point3,function(err,result){
		res.send(result);
		res.end();
	});
});

app.post('/accept-form', function(req,res){
	console.log ("webAPI -- /accept-form");
    var id = req.body.id;
    var role = req.body.role;
    if (role == 'Monitor') {
        var monitor_verify = 1;
        var teacher_verify = 0;
    }
    else if (role == 'Teacher') {
        var monitor_verify = 1;
        var teacher_verify = 1;
    } 
	SQL.higherSubmitForm(id,monitor_verify,teacher_verify,function(err,result){
		res.send(result);
		res.end();
	});
});

app.post('/reject', function(req,res){
	console.log ("webAPI -- /reject");
    var id = req.body.id;
    var idReject = req.body.idReject;
    var role = req.body.role;
    var content = req.body.content;
    
    if (role == 'Monitor') {
        var student_verify = 0;
        var monitor_verify = 0;
        var teacher_verify = 0;
        var IDtarget = id;
    }
    else if (role == 'Teacher') {
        var student_verify = 1;        
        var monitor_verify = 0;
        var teacher_verify = 0;
        var IDtarget = 4;
    } 

    SQL.rejectMsg(id,idReject,content,student_verify,monitor_verify,teacher_verify,IDtarget,function(err,result){
		res.send(result);
		res.end();
	});
});

app.post('/get-msg', function(req,res){
    console.log ("webAPI -- /get-msg");
    var id = req.body.id;    
	SQL.getMsgByID(id,function(err,result){
		res.send(result);
		res.end();
	});
});
