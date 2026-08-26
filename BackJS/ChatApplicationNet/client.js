const net = require("node:net");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = net.createConnection({ port: 3001, host: "localhost" }, () => {
  rl.question("Enter a username: ", (username) => {
    socket.write(username.trim() + "\n");
  });
});

socket.on("data", (data) => {
  const response = data.toString();

  if (response.startsWith("SUCCESS:")) {
    const name = response.split(":")[1].trim();
    console.log(`Connected as ${name}. Type messages or /msg <user> <msg>, /who, /exit.`);
    promptUser();
  } else if (
    response.includes("Username cant be empty") ||
    response.includes("Username already busy")
  ) {
    console.log(response.trim());
    rl.question("Enter a username: ", (username) => {
      socket.write(username.trim() + "\n");
    });
  } else {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    console.log(response.trim());
    promptUser();
  }
});

function promptUser() {
  rl.question("> ", (answer) => {
    if (answer.trim() === "/exit") {
      socket.end();
      process.exit(0);
    }
    socket.write(answer + "\n");
  });
}

socket.on("error", (err) => {});

socket.on("close", () => {
  console.log("Connection closed.");
  process.exit(0);
});