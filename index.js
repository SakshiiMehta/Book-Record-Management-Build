const express = require("express"); //Importing express

const userRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const app = express();

const PORT = 8081;

app.use(express.json()); //response in json format

app.get("/", (req, res) => {
  res.status(200).json({
    //.json=> sending response back in the json format
    message: "Server is up and running ",
    Data: "Hey",
  });
});

app.use("/users", userRouter);
app.use("/books", booksRouter); // call booksrouter if the route is books

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
