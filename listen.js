const app = require("./app");

const { PORT = 9090 } = procces.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
