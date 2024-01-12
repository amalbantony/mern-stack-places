const HttpError = require("../modal/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "MAx Schwartz",
    email: "test@test.com",
    password: "test1234",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
  //
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Inputs You entered are invalid", 422);
  }

  const hasUser = DUMMY_USERS.find((user) => user.email === email);

  if (hasUser) {
    throw new HttpError("Couldnt create user.Email already exists", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  //

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const logIn = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Couldnt find user with Given credentials", 401);
  }

  res.json({ message: "Logged In" });

  //
};

exports.logIn = logIn;
exports.getUsers = getUsers;
exports.signUp = signUp;
