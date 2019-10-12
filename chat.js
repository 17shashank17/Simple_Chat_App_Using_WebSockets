var express=require('express');

var app=express();

var server=require('http').createServer(app);

users=[]
connections=[]
user_and_room=[]

var io=require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);

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
        socket.username=data.username;
        users.push(data.username);
        socket.roomId=data.room;
        //console.log(socket.roomId);
        //io.sockets.emit('take users',{username:users});
        var flag=1;
        for(var i=0;i<user_and_room.length;i++){
            if (user_and_room[i].key==data.room){
                user_and_room[i].member.push(data.username);
                r=i;
                flag=0;
            }
        }
        user_and_room.push({
            key:data.room,
            member:[data.username]
        });
        if(flag==0){
            members=user_and_room[r].member;
        }
        else{
            members=user_and_room[user_and_room.length-1].member;
        }
        socket.members=members;
        console.log(socket.members);
        
        updataUsername();
    });
    function updataUsername(){
        io.sockets.emit('take users',{username:socket.members,room:socket.roomId});
    }

    
})