import {
  View,
  Text,
  SafeAreaView,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { selectUser, setUserDetails } from "../features/authSlice";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId:
      "891471438249-ppl2903oh2jndbbr0crmd3uc458hl15t.apps.googleusercontent.com",
    iosClientId:
      "131816244749-4cr82hhdkskvev9r2kn2mgu5ugp4384d.apps.googleusercontent.com",
    androidClientId:
      "131816244749-bvr636kfm300sr1mn2ts5ao1kvcsoi4g.apps.googleusercontent.com",
    //   webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const {
        params: { id_token: idToken },
      } = response;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then((user) => {
          dispatch(setUserDetails(user["_tokenResponse"]));
          navigation.navigate("Home");
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, [response]);

  const signInWithGoogle = async () => {
    promptAsync();
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={{
          url: "https://tinder.com/static/tinder.png",
        }}
        className="flex-1"
      >
        <TouchableOpacity
          className="absolute bottom-40 w-52 bg-white p-4 rounded-2xl"
          style={{
            marginHorizontal: "25%",
          }}
          onPress={signInWithGoogle}
        >
          <Text className="text-center font-bold"> Sign In & Get Swipping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
