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

/*
 *Route:/users/:id
 *Method:GET
 *Description: Single Users by their id
 *Access: Public
 *Parameters: Id
 */
app.get("/users/:id", (req, res) => {
  const { id } = req.params; // fetching the ID from req parameter
  const user = users.find((each) => each.id === id); // save the data in var user ==> each means i want to go through each and every elements of that array
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }
  return res.status(200).json({
    success: true,
    message: "User Found",
    data: user,
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    //.json=> sending response back in the json format
    message: "Server is up and running ",
    Data: "Hey",
  });
});

/*
 *Route:/users/
 *Method:POST
 *Description: Creating a new user
 *Access: Public
 *Parameters: none
 */

app.post("/users", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;

  const user = users.find((each) => each.id === id);

  if (user) {
    return res.status(404).json({
      success: false,
      message: "User with the same ID exists",
    });
  }

  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });

  return res.status(201).json({
    success: true,
    message: "User added successfully",
    data: users,
  });
});

/*
 *Route:/users/:id
 *Method:PUT
 *Description: Updating a user by id
 *Access: Public
 *Parameters: ID
 */

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const user = users.find((each) => each.id === id); // save the data in var user ==> each means i want to go through each and every elements of that array
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }
  const updateUserData = users.map((each) => {
    if (each.id === id) {
      return {
        ...each, // spread operator
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    message: "User updated",
    data: updateUserData,
  });
});

/*
 *Route:/users/:id
 *Method:DELETE
 *Description: Deleting a user by id
 *Access: Public
 *Parameters: ID
 */

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id); // save the data in var user ==> each means i want to go through each and every elements of that array
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }
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
