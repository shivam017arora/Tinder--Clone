import {
  View,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { selectUser, setUserDetails } from "../features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/core";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { Entypo } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const HomeScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const swipeRef = useRef(null);

  const [profiles, setProfiles] = useState([]);

  const signOutOfGoogle = async () => {
    await signOut(auth)
      .then(() => {
        dispatch(setUserDetails(null));
      })
      .catch((error) => console.log(error));
  };

  const fetchCards = async () => {
    console.log("Calling fetch cards");
    let passes = [];
    let accepts = [];
    await getDocs(collection(db, "users", user.localId, "passes")).then(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          passes.push(doc.id);
        }),
          console.log("Pas's", passes);
      }
    );
    await getDocs(collection(db, "users", user.localId, "accepts")).then(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          accepts.push(doc.id);
        }),
          console.log("Acc's", accepts);
      }
    );

    const passedUsers = passes.length > 0 ? passes : ["test"];
    const acceptedUsers = accepts.length > 0 ? accepts : ["test"];

    unsub = onSnapshot(
      query(
        collection(db, "users"),
        where("id", "not-in", [...passedUsers, ...acceptedUsers])
      ),
      (snapshot) => {
        console.log("Total cards:", snapshot.docs.length);
        setProfiles(
          snapshot.docs
            .filter((doc) => doc.id !== user.localId)
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
        );
      }
    );
  };

  React.useEffect(() => {
    let unsub;

    if (!user) {
      navigation.navigate("Login");
    } else {
      fetchCards();
      return unsub;
    }
  }, [user]);

  return (
    <View className="bg-white">
      {user === null ? (
        <></>
      ) : (
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="bg-white flex-row justify-between items-center p-4 px-8">
            <TouchableOpacity onPress={signOutOfGoogle}>
              <Image
                source={{
                  uri: user.photoUrl,
                }}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
              <Image
                source={{
                  url: "https://tinder.com/static/tinder.png",
                }}
                className="w-14 h-14 rounded-full"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
              <Entypo name="chat" size={30} color="#fe3c72" />
            </TouchableOpacity>
          </View>
          {/* End of Header */}
          <View>
            <Swiper
              ref={swipeRef}
              cards={profiles}
              stackSize={5}
              cardIndex={0}
              verticalSwipe={false}
              animateCardOpacity={true}
              renderCard={(card) => {
                return (
                  <View className="bg-white h-3/4 rounded-xl shadow-lg">
                    {card ? (
                      <>
                        <Image
                          source={{
                            uri: card.pic,
                          }}
                          className="w-full h-3/4"
                        />
                        <View className="flex-row bg-white w-full justify-between p-4 pb-0">
                          <View>
                            <Text>{card.displayName} </Text>
                            <Text className="text-gray-400">{card.job}</Text>
                          </View>
                          <Text className="font-bold text-2xl text-gray-400">
                            {card.age}
                          </Text>
                        </View>
                        <View className="flex-row justify-evenly p-2 mb-16">
                          <TouchableOpacity
                            onPress={() => swipeRef.current.swipeLeft()}
                            className="flex justify-center items-center w-16 h-16 bg-red-200 rounded-full"
                          >
                            <Entypo name="cross" size={40} color="red" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => swipeRef.current.swipeRight()}
                            className="flex justify-center items-center w-16 h-16 bg-green-200 rounded-full"
                          >
                            <Entypo name="heart" size={40} color="green" />
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <View className="justify-center items-center flex-1 flex">
                        <Text className="text-gray-400 text-2xl">
                          No more profiles to show
                        </Text>
                        <Image
                          source={{
                            uri: "https://hotemoji.com/images/dl/x/sad-emoji-by-google.png",
                          }}
                          className="w-32 h-32"
                        />
                      </View>
                    )}
                  </View>
                );
              }}
              overlayLabels={{
                left: {
                  title: "NOPE",
                  style: {
                    label: {
                      color: "red",
                      textAlign: "right",
                    },
                  },
                  right: {
                    title: "LIKE",
                    style: {
                      label: {
                        color: "green",
                      },
                    },
                  },
                },
              }}
              onSwipedLeft={async (cardIndex) => {
                console.log("left swipe");
                if (!profiles[cardIndex]) return;
                const userSwiped = profiles[cardIndex];
                await setDoc(
                  doc(db, "users", user.localId, "passes", userSwiped.id),
                  userSwiped
                )
                  .then(() => {})
                  .catch((error) => console.log(error));
              }}
              onSwipedRight={async (cardIndex) => {
                console.log("right swipe");
                if (!profiles[cardIndex]) return;
                const userSwiped = profiles[cardIndex];

                //accepts
                await setDoc(
                  doc(db, "users", user.localId, "accepts", userSwiped.id),
                  userSwiped
                )
                  .then(() => {})
                  .catch((error) => console.log(error));

                //check if user swiped on you
                getDoc(doc(db, "users", userSwiped.id, "accepts", user.localId))
                  .then(async (doc) => {
                    if (doc.exists) {
                      console.log("Thats a match!");
                      //create matches
                      // await setDoc(
                      //   doc(
                      //     db,
                      //     "matches",
                      //     generateId(user.localId, userSwiped.id)
                      //   ),
                      //   {
                      //     users: {
                      //       [user.localId]: loggedInProfile,
                      //       [userSwiped.id]: userSwiped,
                      //     },
                      //     usersMatched: [user.localId, userSwiped.id],
                      //     timestamp: serverTimestamp(),
                      //   }
                      // )
                      //   .then(() => {
                      //     console.log("Match created");
                      //   })
                      //   .catch((error) => console.log(error));
                    } else {
                      console.log("Not a match");
                    }
                  })
                  .catch((e) => console.log(e));
              }}
            />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomeScreen;
