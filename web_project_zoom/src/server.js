import http from "http";
import SocketIO from "socket.io";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
/*app.set("view engine", "ejs");*/
app.engine('html', require('ejs').renderFile);

app.use("/public", express.static(__dirname + "/public"));
//localhost:3000에 더 써도 무조건 go to home
app.get("/", (_, res) => {
  res.render(__dirname + "/views/home.pug");
});
app.get("/paint", (_, res) => {
  res.render(__dirname + "/views/paint.html");
});


//동일 서버에서 http, ws 작동시키기
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

//connection해서 socket을 알아낸다
wsServer.on("connection", (socket) => {
  //frontend와 실시간 소통
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
