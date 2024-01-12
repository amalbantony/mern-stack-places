const express = require("express");
const { check } = require("express-validator");
const placesController = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesController.getPlacesByPlaceID);

router.get("/user/:uid", placesController.getPlacesByUserID);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty().isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesController.createNewPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty().isLength({ min: 5 }),
  ],
  placesController.updatePlaceByID
);

router.delete("/:pid", placesController.deletePlaceByID);

module.exports = router;
