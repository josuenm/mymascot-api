import express from "express";
import { addToFavoriteController } from "../controllers/user/favorites/addToFavoriteController";
import { removeToFavoriteController } from "../controllers/user/favorites/removeToFavoriteController";
import { signInController } from "../controllers/user/signInController";
import { signUpController } from "../controllers/user/signUpController";

const route = express.Router();

// { BEGIN: access }
route.post("/signUp", signUpController);
route.post("/signIn", signInController);
// { END: access }

// { BEGIN: favorites }
route.post("/addToFavorites", addToFavoriteController);
route.post("/removeToFavorites", removeToFavoriteController);
// { END: favorites }

export default route;
