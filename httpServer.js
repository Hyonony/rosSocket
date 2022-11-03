const express = require('express')
const app = express()
const httpserver = require('http').createServer(app)
const io = require('socket.io')(httpserver)
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
require("dotenv").config();
const net = require('net'),
      tcpPort = process.env.tcp_port,
      httpPort = process.env.http_port
const client = net.connect({port: tcpPort, host:'localhost'})
const cors = require('cors')

const options = {
  origin: 'http://localhost:3000',
  Credential: true,
};

var count = 0;


httpserver.listen(httpPort, ()=> {
  console.log(`HTTP Server is listening on port ${httpPort}`)
});


app.use(cors(options))
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname + '/html'))

app.use(bodyParser.json())
app.use('/', serveStatic(path.join(__dirname, 'view')))

app.use((req, res) => {
  res.status(404).send('Not Found')
})



io.on('connection', (socket)=> {
  //연결되면 socket 파라미터에 socket 데이터가 쌓임
  
  count++
  // const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3];
  // console.log(ip);
  console.log('Http connection :', socket.request.connection._peername);
  // console.log(socket);
  // 확인하려면 위에 터미널에 찍어볼 수 있음
  
  socket.on('message', (message)=>{
    // message라는 약속으로 통신을 하는 것 프론트와 같은 네임을 가져야함
    
    client.write(`"${message}"`)
    //TCP <-> Http 연결에 필요한 객체를 사용하여 TcpBroadCast 함수로 데이터 전송
    io.emit('message', `${count}번 익명자 : ${message}`);
  })

  socket.on('disconnect', () => {
    console.log('Http User Disconnected');
    count--;
  });
});

