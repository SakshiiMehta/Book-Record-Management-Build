const express = require("express"); //Importing express
const { users } = require("./Data/users.json"); //To access users file

const app = express();

const PORT = 8081;

app.use(express.json()); //response in json format

/*
 *Route:/users
 *Method:GET
 *Description: Get all Users
 *Access: Public
 *Parameters:None
 */

app.get("/users", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    //.json=> sending response back in the json format
    message: "Server is up and running ",
    Data: "Hey",
  });
});

// To normally send message use 'send'
// app.get("/", (req, res) => {
//   res.status(200).send("server is up")
// });

app.get("*", (req, res) => {
  res.status(404).json({
    message: "This route doesn't exist",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
