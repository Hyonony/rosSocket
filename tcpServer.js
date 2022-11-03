const net = require('net')
require('dotenv').config()
const tcpPort = process.env.TCP_PORT
const clients = [];
require('./httpServer');

net.createServer(function (socket) {
    socket.setEncoding('utf-8')
    //utf8로 인코딩, '' 사이에 다른 변수로 넣을 수 있음.
    
    // clients의 ID 값 [ex)::ffff:127.0.0.1:50573]
    socket.name = socket.remoteAddress + ":" + socket.remotePort 
  
    // 새로운 client를 list에 저장
    clients.push(socket)
    
    // Send a nice welcome message and announce
    // socket.write("Welcome " + socket.name + "\n");
    console.log("\n" + socket.name + " joined\n")
    
    //TcpBroadCast(socket.name + " joined\n")
  
  
    // 클라이언트에 들어오는 메시지를 처리
    // write는 데이터를 보낼 떄 사용
    socket.on('data', function (data) {
      // console.log(data)
      // socket.write()
      TcpBroadCast(data, socket)
      // TcpBroadCast(Data, socket);
  
      
    });
    
    // 클라이언트가 떠났을 경우 처리
    socket.on('close', ()=>{
      console.log('client disconnected')
    })
    socket.on('end', function () {
      // 떠난 클라이언트를 삭제
      clients.splice(clients.indexOf(socket), 1)
      console.log("\n" + socket.name + " left\n")
    });
    
    // 클라이언트들에게 데이터를 BroadCast 
    function TcpBroadCast(message, sender) {
      clients.forEach(function (client) {
        // Don't want to send it to sender
        if (client === sender) return;
        client.write(message);
      });
      // 서버 내에서 출력하여 확인
      process.stdout.write(message)
    }
    //console.log(clients.length)
  
  }).listen(tcpPort, ()=>{
    console.log(`TCP Server is listening on port ${tcpPort}`);
  }); // TCP Server listen 상태