var mysql = require("mysql");
var express = require("express");

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "hanoi123",
	database: "SOA2"
});

con.connect(function(err){
	if(err){
		console.log("Error connecting to database");
		return;
	}
	console.log("Connection to databases established");
});

exports.Login = function Login(username,password,callback){
	con.query("select ID,Role,Name from users where Username='" +username+ "' and Password = '"+password+"'",function(err,rows){
		var result = {'data':rows};
		callback(null,result);
	});
}

exports.getFormByID = function getFormByID(id,callback){
	con.query("select f.*,u.Name from form f left join users u on u.ID = f.User_ID where u.ID = '"+id+"';",function(err,rows){
		console.log(rows);
		result =  {'status':rows};
		callback(null,result);
	});
}

exports.getForm = function getForm(callback){
    sendAllForm(function(err,result){
        callback(null,result);
    });
}

function sendAllForm(callback){
	con.query("select f.*,u.Name from form f left join users u on u.ID = f.User_ID;",function(err,rows){
		result =  {'status':rows};
		callback(null,result);
	});
} 

exports.studentSubmitForm = function studentSubmitForm(id,point1,point2,point3,callback){
    con.query("UPDATE `soa2`.`form` SET `Point1`='"+point1+"', `Point2`='"+point2+"', `Point3`='"+point3+"', `student_verify`='1' ,`monitor_verify` = '0', `teacher_verify` = '0' WHERE `User_ID`='"+id+"';",function(err,rows){
        updateForm(id,function(err,result){
			callback(null,result);
		});
	});
}

function updateForm(id,callback){
	con.query("select f.*,u.Name from form f left join users u on u.ID = f.User_ID where u.ID = '"+id+"';",function(err,rows){
		console.log(rows);
		result =  {'status':rows};
		callback(null,result);
	});
}

exports.higherSubmitForm = function higherSubmitForm(id,monitor_verify,teacher_verify,callback){
    con.query("UPDATE `soa2`.`form` SET `monitor_verify` = '"+monitor_verify+"', `teacher_verify` = '"+teacher_verify+"' WHERE `User_ID`='"+id+"';",function(err,rows){
		sendAllForm(function(err,result){
			callback(null,result);
		});
	});
}

exports.rejectMsg = function rejectMsg(id,idReject,content,student_verify,monitor_verify,teacher_verify,IDtarget,callback){
    var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
    con.query("INSERT INTO `soa2`.`msg` (`IDSender`, `Content`, `createdTime`, `IDForm`, `IDTarget`) VALUES ('"+idReject+"', '"+content+"', '"+d+"', '"+id+"', '"+IDtarget+"');",function(err,rows){
        updateRejectForm(id,student_verify,monitor_verify,teacher_verify,function(err,result){
			callback(null,result);
		});
	});
}

function updateRejectForm(id,student_verify,monitor_verify,teacher_verify,callback){
    con.query("UPDATE `soa2`.`form` SET `student_verify`='"+student_verify+"' ,`monitor_verify` = '"+monitor_verify+"', `teacher_verify` = '"+teacher_verify+"' WHERE `User_ID`='"+id+"';",function(err,rows){
        sendAllForm(function(err,result){
			callback(null,result);
		});
    });
}

exports.getMsgByID = function getMsgByID(id,callback){
	con.query("select * from msg where IDTarget ='" +id + "'",function(err,rows){
        var result =  {'data':rows};
        callback(null,result);
	});
}