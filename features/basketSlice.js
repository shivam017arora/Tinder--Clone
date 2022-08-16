import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload
      );
      let newBasket = [...state.items];
      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.log("Item not found in basket");
      }
      state.items = newBasket;
    },
    clearBasket: (state, action) => {
      console.log("clearBasket");
      state.items = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToBasket, removeFromBasket, clearBasket } =
  basketSlice.actions;

export const selectBasketItems = (state) => state.basket.items;
export const selectBasketItemsWithId = (state, idx) =>
  state.basket.items.filter((item) => item._id === idx);
export const selectBasketTotal = (state) =>
  //get total price of all items in basket
  state.basket.items.reduce((total, item) => total + item.price, 0);

export default basketSlice.reducer;
