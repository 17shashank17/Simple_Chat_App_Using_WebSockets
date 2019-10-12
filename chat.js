var express=require('express');

var app=express();

var server=require('http').createServer(app);

users=[]
connections=[]

var io=require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

//console.log("created")

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){

    connections.push(socket);
    console.log('Connected are %s',connections.length);

    socket.on('disconnect',function(data){
        users.splice(users.indexOf(socket.username),1);
        //io.sockets.emit('take users',{username:users});
        updataUsername();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected, %s are still connected',connections.length);
    });

    socket.on('send message',function(data){
        //console.log(data);
        io.sockets.emit('new message',{msg:data,username:socket.username});
    });

    socket.on('new login',function(data,callback){
        callback(true);
        socket.username=data;
        users.push(data);
        //io.sockets.emit('take users',{username:users});
        updataUsername();
    })
    function updataUsername(){
        io.sockets.emit('take users',{username:users});
    }

    
})