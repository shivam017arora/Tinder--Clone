import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

const PreparingOrderScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Navigating...");
      navigation.navigate("Delivery");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* <Animatable.Image
        animation="slideInUp"
        iterationCount={1}
        className="w-full h-full"
        source={require("../assets/loading.gif")}
      /> */}
      <Animatable.Text
        animation="slideInUp"
        iterationCount={1}
        className="text-md my-10 text-black font-bold text-center"
      >
        Loading...
      </Animatable.Text>
    </View>
  );
};

export default PreparingOrderScreen;
