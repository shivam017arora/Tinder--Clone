import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { client, urlFor } from "../sanity";

function CategoryCard({ imgUrl, title }) {
  return (
    <TouchableOpacity className="mr-1 relative">
      <Image
        source={{
          uri: urlFor(imgUrl).url(),
        }}
        className="h-28 w-20 rounded-lg"
      />
      <Text className="bottom-1 left-1 absolute text-white font-bold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `
      *[_type == "category"]`
      )
      .then((categories) => {
        setCategories(categories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categories?.map((category) => (
        <CategoryCard
          key={category._id}
          imgUrl={category.image}
          title={category.name}
        />
      ))}
    </ScrollView>
  );
}
