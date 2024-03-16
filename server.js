const WebSocket = require('ws');

const wss = new WebSocket.Server({ host: '127.0.0.1', port: 3000 });

const clients = new Set();

wss.on('connection', function connection(ws) {
  clients.add(ws);
  
  ws.on('message', function incoming(data) {
    data = data.toString();
    data = JSON.parse(data)

    for (const client of clients) {
        if (client !== ws) {
            client.send(JSON.stringify({
                connection: clients.size,
                name: data.name,
                data: data.data.toString()
            }));
        }
        }
  });
  
  ws.on('close', function() {
    clients.delete(ws);
  });
});
