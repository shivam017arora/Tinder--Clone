import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectRestaurant } from "../features/restaurantSlice";
import {
  selectBasketItems,
  selectBasketTotal,
  clearBasket,
} from "../features/basketSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { XCircleIcon } from "react-native-heroicons/outline";
import { urlFor } from "../sanity";

const BasketScreen = () => {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  const items = useSelector(selectBasketItems);
  const [groupedItems, setGroupedItems] = React.useState([]);
  const basketTotal = useSelector(selectBasketTotal);
  const dispatch = useDispatch();

  useMemo(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item._id] = results[item._id] || []).push(item);
      return results;
    }, {});
    setGroupedItems(groupedItems);
  }, [items]);

  const clearItems = () => {
    dispatch(clearBasket());
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-gray-100">
        <View className="p-5 border-b border-[#00CCBB] shadow-xs bg-white">
          <View>
            <Text className="text-lg font-bold text-center">Basket</Text>
            <Text className="text-center text-gray-400">
              {restaurant?.title}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="absolute top-1 right-5 bg-gray-100 rounded-full p-2"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <XCircleIcon color="#00CCBB" size={40} opacity={0.9} />
        </TouchableOpacity>
        <View className="flex-row items-center space-x-4 px-4 py-3 bg-white m-5">
          <Image
            source={{
              uri: "https://links.papareact.com/wru",
            }}
            className="w-7 h-7 bg-gray-300 p-4 rounded-full"
          />
          <Text className="flex-1">Deliver in 50-75 min</Text>
          <TouchableOpacity>
            <Text className="text-[#00CCBB]">Change</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {Object.entries(groupedItems).map(([key, items]) => (
            <View
              className="flex-row items-center space-x-4 px-4 py-3 bg-white"
              key={key}
            >
              <Text>{items.length} x </Text>
              <Image
                source={{
                  uri: urlFor(items[0]?.image).url(),
                }}
                className="w-7 h-7 bg-gray-300 p-4 rounded-full"
              />
              <Text className="flex-1">{items[0]?.name}</Text>
              <Text className="text-gray-400">{items[0]?.price}</Text>
            </View>
          ))}
        </ScrollView>
        <View className="mt-5 spacy-y-4">
          <View className="flex-row items-center space-x-4 px-4 py-3 bg-white justify-between">
            <Text className="text-gray-400">Subtotal</Text>
            <Text className="text-gray-400">${basketTotal}</Text>
          </View>
          <View className="flex-row items-center space-x-4 px-4 py-3 bg-white justify-between">
            <Text className="text-gray-400">Delivery Fee</Text>
            <Text className="text-gray-400">$5.99</Text>
          </View>
          <View className="flex-row items-center space-x-4 px-4 py-3 bg-white justify-between">
            <Text className="text-black font-extrabold">Order Total</Text>
            <Text className="text-gray-400">${basketTotal + 5.99}</Text>
          </View>
          <TouchableOpacity
            className="rounded-lg bg-[#00CCBB] p-4 m-1"
            onPress={() => {
              clearItems();
              navigation.navigate("PreparingOrderScreen");
            }}
          >
            <Text className="text-center text-white text-lg font-bold">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BasketScreen;
