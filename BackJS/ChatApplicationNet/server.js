const net = require("node:net");

const users = new Map();
const commands = new Map();

const broadcast = (msg, sender) => {
  if (!msg.endsWith("\n")) msg += "\n";
  for (const user of users.values()) {
    if (sender !== user) user.write(msg);
  }
};

const unicast = (msg, senderName, destName) => {
  if (!msg.endsWith("\n")) msg += "\n";

  users.get(destName).write(`[DM from ${senderName}]: ${msg}`);
  users.get(senderName).write(`[you -> ${destName}]: ${msg}`);
};

const showUsers = (socket) => {
  let list = "Connected users:\n";
  for (const user of users.keys()) {
    list += `-- ${user}\n`;
  }
  socket.write(list);
};

commands.set("/msg", unicast);
commands.set("/who", showUsers);
commands.set("/exit", (sock) => sock.end());

const server = net.createServer((socket) => {
  let username = null;
  console.log("client connected");
  let buffer = "";

  socket.on("data", (chunk) => {
    buffer += chunk.toString();
    let position = null;
    while ((position = buffer.indexOf("\n")) !== -1) {
      const message = buffer.slice(0, position).trim();
      buffer = buffer.slice(position + 1);

      if (username === null) {
        if (!message) {
          socket.write("Username cant be empty: Enter again!\n");
        } else if (users.has(message)) {
          socket.write("Username already busy: Enter Again\n");
        } else {
          username = message;
          users.set(username, socket);
          socket.write(`SUCCESS:${username}\n`);
          broadcast(`*** ${username} joined ***`, socket);
        }
      } else {
        if (message.startsWith("/")) {
          const msg = message.split(" ");
          const command = msg[0];
          const targetUser = msg[1];
          const text = msg.slice(2).join(" ");

          if (!commands.has(command)) {
            socket.write("Invalid command!\n");
            continue;
          }

          const cb = commands.get(command);

          if (command === "/msg") {
            if (!users.has(targetUser)) {
              socket.write("User not found!\n");
              continue;
            }
            if (!text.trim()) {
              socket.write("message not found!\n");
              continue;
            }
            cb(text, username, targetUser);
          } else {
            cb(socket);
          }
        } else {
          broadcast(`[${username}]: ${message}`, socket);
        }
      }
    }
  });

  socket.on("error", (err) => {});

  socket.on("close", () => {
    if (username !== null) {
      users.delete(username);
      broadcast(`*** ${username} disconnected ***`, socket);
    }
  });
});

server.listen(3001, "localhost", () => {
  console.log("Chat app started on port 3001");
});