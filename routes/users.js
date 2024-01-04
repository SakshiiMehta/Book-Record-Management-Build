const express = require("express");
const { users } = require("../data/users.json");
const router = express.Router();

/*
 *Route:/users
 *Method:GET
 *Description: Get all Users
 *Access: Public
 *Parameters:None
 */

router.get("/", (req, res) => {
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
router.get("/:id", (req, res) => {
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

/*
 *Route:/users/
 *Method:POST
 *Description: Creating a new user
 *Access: Public
 *Parameters: none
 */

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id); // save the data in var user ==> each means i want to go through each and every elements of that array
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }
  const index = users.indexOf(user); // in the users string index of method is used to return the (user) in the array
  users.splice(index, 1);

  return res
    .status(200)
    .json({ success: true, message: "Deleted user..", data: users });
});

/*
 *Route:/users/subscription-details/:id
 *Method:GET
 *Description: Get all user subscription details
 *Access: Public
 *Parameters: ID
 */

router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User With The Given Id Doesn't Exist",
    });
  }
  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      // current Date
      date = new Date();
    } else {
      // getting date on a basis of data variable
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };

  // Jan 1 1970 UTC
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  const data = {
    ...user,
    isSubscriptionExpired: subscriptionExpiration <= currentDate,
    daysLeftForExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionExpiration - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 100
          : 50
        : 0, //This is a nested loop -- Rs 100 fine if return date is < current dats, Rs 50 fine if subscription dats < current date and no fine if subscription date = current date
  };
  return res.status(200).json({
    success: true,
    message: " Subscription detail for the user is : ",
    data,
  });
});

module.exports = router;
