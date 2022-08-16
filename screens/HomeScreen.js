import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AdjustmentsIcon,
  ChevronDownIcon,
  SearchIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import { client } from "../sanity";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [featuredCategories, setFeaturedCategories] = React.useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "featured"] {
        ...,
        restaurants[]->{
          ...,
          dishes[]->
        }
      }`
      )
      .then((categories) => {
        setFeaturedCategories(categories);
      });
  }, []);

  return (
    <SafeAreaView className="mb-32">
      {/* Header  */}
      <View className="flex-row pb-3 items-center mx-4 space-x-2">
        <Image
          source={{
            uri: "https://links.papareact.com/wru",
          }}
          className="h-7 w-7 bg-gray-300 p-4 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-bold text-gray-400 text-xs">Deliver Now</Text>
          <Text className="font-bold text-black-900 text-xl">
            Current Location
            <ChevronDownIcon size={20} color="#00CCBB" />
          </Text>
        </View>
        <UserIcon size={35} color="#00CCBB" />
      </View>
      {/* Search  */}
      <View className="flex-row items-center space-x-2 pb-2 mx-4">
        <View className="flex-row space-x-2 flex-1 bg-gray-200 items-center pl-2 rounded-md">
          <SearchIcon color="gray" size={20} />
          <TextInput
            placeholder="Resturant, Food, or Cuisines"
            className="w-full py-4 border-gray-300"
          />
        </View>
        <AdjustmentsIcon color="#00CCBB" />
      </View>
      {/* ScrollView  */}
      <ScrollView className="bg-gray-100">
        {/* Categories  */}
        <Categories />

        {/* Featured Rows  */}
        {featuredCategories.map((category) => (
          <FeaturedRow
            key={category._id}
            title={category.name}
            desc={category.short_description}
            id={category._id}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
