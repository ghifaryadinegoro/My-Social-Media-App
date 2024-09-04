import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomePage from "./pages/HomePage";
import { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/auth";
import { Pressable, Text, View } from "react-native";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddPost from "./pages/AddPost";
import SearchUsers from "./pages/SearchUsers";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTab() {
  const { setIsSignedIn, setLoggedInUser } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => {
          return (
            <View className="p-2">
              <Pressable
                onPress={async () => {
                  console.log("Success Logout");
                  
                  await SecureStore.deleteItemAsync("access_token");
                  await SecureStore.deleteItemAsync("user_id");
                  setLoggedInUser(null);
                  setIsSignedIn(false);
                }}
                className="px-2 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium border border-current outline-none bg-red-700 hover:bg-red-800 active:bg-red-700"
              >
                <Text className="text-white">Logout</Text>
              </Pressable>
            </View>
          );
        },
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          headerTitle: "Home",
          tabBarLabel: "Home",
          tabBarActiveTintColor: "black",
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name={props.focused ? "home" : "home-outline"}
                size={props.size}
                color="black"
              ></Ionicons>
            );
          },
        }}
        name="HomePage"
        component={HomePage}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          headerTitle: "Add New Post",
          tabBarLabel: "New Post",
          tabBarActiveTintColor: "black",
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name={props.focused ? "add-circle" : "add-circle-outline"}
                size={props.size}
                color="black"
              ></Ionicons>
            );
          },
        }}
        name="AddPost"
        component={AddPost}
      />
      <Tab.Screen
        options={{
          headerTitle: "Profile",
          tabBarLabel: "Profile",
          tabBarActiveTintColor: "black",
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name={props.focused ? "person" : "person-outline"}
                size={props.size}
                color="black"
              ></Ionicons>
            );
          },
        }}
        name="MyProfile"
        component={MyProfile}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { setIsSignedIn } = useContext(AuthContext);
  const { isSignedIn } = useContext(AuthContext);

  useEffect(() => {
    SecureStore.getItemAsync("access_token").then((r) => {
      console.log(r, "<<< token");
      if (r) {
        setIsSignedIn(true);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            {/* MainTab */}
            <Stack.Screen
              name="MainTab"
              component={MainTab}
              options={{
                headerShown: false,
              }}
            />
            {/* PostDetail */}
            <Stack.Screen
              name={"PostDetail"}
              component={PostDetail}
              options={{
                headerTitle: "Post",
              }}
            />
            {/* SearchUsers */}
            <Stack.Screen
              name={"SearchUsers"}
              component={SearchUsers}
              options={{
                headerShown: false,
              }}
            />
            {/* Followers */}
            <Stack.Screen name={"Followers"} component={Followers} />
            {/* Following */}
            <Stack.Screen name={"Following"} component={Following} />
            {/* UserProfile */}
            <Stack.Screen name={"UserProfile"} component={UserProfile} options={{
              headerTitle:"User Profile"
            }}/>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
