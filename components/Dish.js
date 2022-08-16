import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { client, urlFor } from "../sanity";
import {
  MinusCircleIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBasket,
  removeFromBasket,
  selectBasketItemsWithId,
} from "../features/basketSlice";

const Dish = ({ dish }) => {
  const { name, short_description, price } = dish;
  const [isPressed, setIsPressed] = useState(false);
  const dispatch = useDispatch();
  const items = useSelector((state) =>
    selectBasketItemsWithId(state, dish._id)
  );

  const addItemToBasket = () => {
    console.log("addItemToBasket");
    dispatch(addToBasket(dish));
  };

  const removeItemFromBasket = () => {
    console.log("removeItemFromBasket");
    dispatch(removeFromBasket(dish._id));
  };

  return (
    <>
      <TouchableOpacity
        className={`bg-white border p-4 border-gray-200 ${
          isPressed && "border-b-0"
        }`}
        onPress={() => setIsPressed(true)}
      >
        <View className="flex-row">
          <View className="flex-1 or-2">
            <Text className="text-lg mb-1"> {name} </Text>
            <Text className="text-xs text-gray-400"> {short_description} </Text>
            <Text className="text-gray-400 mt-2">${price}</Text>
          </View>
          <View>
            <Image
              source={{
                uri: urlFor(dish.image).url(),
              }}
              className="w-20 h-20 bg-gray-300 p-4 rounded-lg"
              style={{
                borderColor: "#F3F3F4",
                borderWidth: 1,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>

      {isPressed && (
        <View className="bg-white px-3">
          <View className="flex-row items-center space-x-2 pb-3">
            <TouchableOpacity onPress={() => removeItemFromBasket()}>
              <MinusCircleIcon
                size={40}
                color={items.length ? "#00CCBB" : "gray"}
                disabled={items.length == 0 ? false : true}
              />
            </TouchableOpacity>
            <Text>{items.length}</Text>
            <TouchableOpacity onPress={() => addItemToBasket()}>
              <PlusCircleIcon color="#00CCBB" size={40} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default Dish;
