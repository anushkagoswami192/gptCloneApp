import app from './src/app.js'
import { initSocketServer } from './src/socket/socket.js';
import { createServer } from "http";
import {ConnectToDb} from './src/db/db.js'

ConnectToDb()
const httpServer = createServer(app);
initSocketServer(httpServer)
httpServer.listen(3000, ()=>{
  console.log("server is starting on port 3000")
});
