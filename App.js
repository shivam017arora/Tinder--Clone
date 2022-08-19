import { StatusBar } from "expo-status-bar";
import { TailwindProvider } from "tailwindcss-react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";
import ModalScreen from "./screens/ModalScreen";
import { store } from "./store";
import { Provider } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUserDetails } from "./features/authSlice";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
          // initialRouteName="Login"
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false, // Hide the header
              }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerShown: false, // Hide the header
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false, // Hide the header
              }}
            />
            <Stack.Screen
              name="Modal"
              component={ModalScreen}
              options={{
                headerShown: false, // Hide the header
                presentation: "Modal",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </Provider>
    </TailwindProvider>
  );
}
