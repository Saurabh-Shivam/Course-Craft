import { combineReducers } from "@reduxjs/toolkit";
// importing all reducer which is made into slices;
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice";

/*
here there are multiple reducer like authReducer , profileReducer , cartReducer etc  So we combine all reducer here
in "rootReducer"  and  this "rootReducer" is added into "store" in index.js now we can access all reducer using "store"
*/

// combining all reducer
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  course: courseReducer,
});

export default rootReducer;
