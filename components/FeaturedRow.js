import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import {
  ArrowRightIcon,
  LocationMarkerIcon,
  StarIcon,
} from "react-native-heroicons/outline";
import { client, urlFor } from "../sanity";
import { useNavigation } from "@react-navigation/native";

function RestaurantCard({
  imgUrl,
  title,
  rating,
  genre,
  address,
  desc,
  price,
  id,
  dishes,
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="bg-white mr-3 shadow rounded-lg"
      onPress={() =>
        navigation.navigate("Restaurant", {
          id,
          title,
          imgUrl,
          rating,
          genre,
          address,
          desc,
          price,
          dishes,
        })
      }
    >
      <Image
        source={{
          uri: urlFor(imgUrl).url(),
        }}
        className="h-36 w-64 rounded-lg"
      />
      <View className="px-3 pb-1">
        <Text className="font-bold text-lg pt-2">{title}</Text>
        <View className="flex-row items-center space-x-1">
          <StarIcon color="green" opacity={0.5} size={22} />
          <Text className="text-green-700">{rating}</Text>
          <Text className="text-gray-500">{genre} </Text>
        </View>
      </View>
      <View className="flex-row px-3 pb-2 align-center">
        <LocationMarkerIcon color="gray" size={20} opacity={0.4} />
        <Text className="text-xs text-gray-500"> Nearby {address} </Text>
      </View>
    </TouchableOpacity>
  );
}

const FeaturedRow = ({ title, desc, id }) => {
  const [restaurants, setRestaurants] = React.useState([]);
  useEffect(() => {
    client
      .fetch(
        `*[_type == "featured" && _id == $id] {
        ...,
        restaurants[]->{
          ...,
          dishes[]->
        }
      }[0]`,
        { id }
      )
      .then((restaurants) => {
        setRestaurants(restaurants?.restaurants);
        // console.log(restaurants.restaurants[0].dishes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg px-2">{title}</Text>
        <ArrowRightIcon color="#00CCBB" />
      </View>
      <Text className="text-xs px-6 text-gray-400">{desc}</Text>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {/* Resturant Cards  */}
        {restaurants?.map((restaurant) => {
          return (
            <RestaurantCard
              key={restaurant._id}
              imgUrl={restaurant.image}
              title={restaurant.name}
              rating={restaurant.rating}
              genre={restaurant.category}
              address={restaurant.address}
              desc={restaurant.short_description}
              price={restaurant.price}
              dishes={restaurant.dishes}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;
