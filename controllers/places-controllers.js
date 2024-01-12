const HttpError = require("../modal/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

let DUMMYPLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Phoenix Building",
    description: "One of the tallest in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const getPlaceByPlaceId = (req, res, next) => {
  const placeId = req.params.pid;
  const identifiedPlace = DUMMYPLACES.find((p) => {
    return p.id === placeId;
  });

  if (!identifiedPlace) {
    // let error = new Error("Couldnt find place wiith the given id");
    // error.code = 404;
    // throw error;
    throw new HttpError("Couldnt find place wiith the given id", 404);
  }
  res.json({ identifiedPlace });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const identifiedplaces = DUMMYPLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!identifiedplaces || identifiedplaces.length === 0) {
    return next(
      new HttpError("Couldnt find places for the given user id", 404)
    );
  }
  res.json({ identifiedplaces });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed , Please check your data", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const placeToAdd = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMYPLACES.push(placeToAdd);
  console.log(placeToAdd);
  //

  res.status(201).json({ place: placeToAdd });
};

const updatePlaceById = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed , Please check your data", 422);
  }

  const placeToChange = { ...DUMMYPLACES.find((p) => p.id === placeId) };
  console.log("Place to Change-", placeToChange);
  placeToChange.title = title;
  placeToChange.description = description;

  const index = DUMMYPLACES.findIndex((p) => p.id === placeId);
  console.log("index ->", index);
  DUMMYPLACES[index] = placeToChange;

  res.status(200).json({ place: placeToChange });

  //
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const placeExist = (DUMMYPLACES = DUMMYPLACES.find((p) => p.id === placeId));
  if (!place) {
    throw new HttpError("Place not found. Deletion not possible", 404);
  }

  DUMMYPLACES = DUMMYPLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Place Deleted Successfully" });
};

exports.createNewPlace = createPlace;
exports.getPlacesByPlaceID = getPlaceByPlaceId;
exports.getPlacesByUserID = getPlacesByUserId;
exports.updatePlaceByID = updatePlaceById;
exports.deletePlaceByID = deletePlaceById;
