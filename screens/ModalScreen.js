import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/authSlice";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const ModalScreen = () => {
  const user = useSelector(selectUser);
  const navigation = useNavigation();

  const [pic, setPic] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");

  const [isIncomplete, setIsIncomplete] = useState(true);

  const updateProfile = () => {
    console.log(user.localId);
    setDoc(doc(db, "users", user.localId), {
      id: user.localId,
      displayName: user.displayName,
      pic,
      job,
      age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    if (pic != "" && job != "" && age != "") {
      setIsIncomplete(false);
    }
  }, [pic, job, age]);

  return (
    <SafeAreaView className="flex-1 items-center pt-1">
      <Image
        source={{
          uri: "https://links.papareact.com/2pf",
        }}
        className="w-full h-20"
        resizeMode="contain"
      />
      <Text className="text-gray-400 font-bold p-2 text-xl">
        Welcome {user.displayName}
      </Text>
      <Text className="text-center p-4 font-bold text-red-400">
        Step 1: The Profile Pic
      </Text>
      <TextInput
        placeholder="Enter your profile pic url"
        className="p-2 text-xl"
        value={pic}
        onChangeText={(text) => setPic(text)}
      />
      <Text className="text-center p-4 font-bold text-red-400">
        Step 2: The Job
      </Text>
      <TextInput
        placeholder="Enter your job"
        className="p-2 text-xl"
        value={job}
        onChangeText={(text) => setJob(text)}
      />
      <Text className="text-center p-4 font-bold text-red-400">
        Step 3: The Age
      </Text>
      <TextInput
        placeholder="Enter your age"
        className="p-2 text-xl"
        value={age}
        keyboardType="numeric"
        returnKeyType="done"
        onChangeText={(text) => setAge(text)}
      />

      <TouchableOpacity
        className={
          "w-64 p-4 rounded-xl absolute bottom-10 " +
          (isIncomplete === true ? "bg-gray-400" : "bg-red-400")
        }
        // disabled={isIncomplete}
        onPress={updateProfile}
      >
        <Text className="text-white text-center"> Update Profile </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ModalScreen;
