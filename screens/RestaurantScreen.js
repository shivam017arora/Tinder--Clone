import { View, Image, ScrollView, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { urlFor } from "../sanity";
import {
  ArrowLeftIcon,
  LocationMarkerIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from "react-native-heroicons/outline";
import Dish from "../components/Dish";
import BasketIcon from "../components/BasketIcon";
import { selectBasketItems } from "../features/basketSlice";
import { setRestaurant } from "../features/restaurantSlice";
import { useDispatch, useSelector } from "react-redux";

export default function RestaurantScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    params: { imgUrl, title, rating, genre, address, desc, dishes, id },
  } = useRoute();

  const items = useSelector((state) => selectBasketItems(state));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    dispatch(
      setRestaurant({ imgUrl, title, rating, genre, address, desc, dishes, id })
    );
  }, []);

  return (
    <>
      {items.length != 0 && <BasketIcon />}

      <ScrollView>
        <View className="relative">
          <Image
            source={{
              uri: urlFor(imgUrl).url(),
            }}
            className="w-full h-56 bg-gray-300 p-4"
          />
          <TouchableOpacity
            className="absolute top-14 left-5 bg-gray-100 rounded-full p-2"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon color="#00CCBB" size={20} opacity={0.9} />
          </TouchableOpacity>
        </View>
        <View className="bg-white">
          <View className="px-4 pt-4">
            <Text className="text-3xl font-bold">{title}</Text>
            <View className="flex-row space-x-2 my-1">
              <StarIcon color="green" opacity={0.5} size={22} />
              <Text className="text-green-700">{rating}</Text>
              <LocationMarkerIcon color="gray" size={20} opacity={0.4} />
              <Text className="text-gray-500">Nearby {address} </Text>
            </View>
          </View>
          <Text className="text-gray-500 mt-2 p-4">{desc} </Text>
        </View>

        <TouchableOpacity className="flex-row items-center space-x-2 p-4 border-y border-gray-300">
          <QuestionMarkCircleIcon color="gray" size={20} opacity={0.4} />
          <Text className="pl-2 flex-1 text-md font-bold">
            {" "}
            Have a food allergy?{" "}
          </Text>
        </TouchableOpacity>

        <View className="pb-36">
          <Text className="pt-6 px-4 font-bold mb-3 text-xl"> Menu </Text>
          {/* <Dishes /> */}
          {dishes.map((dish) => (
            <Dish key={dish._id} dish={dish} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
