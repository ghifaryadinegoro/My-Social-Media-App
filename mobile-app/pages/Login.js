import { useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contexts/auth";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../query/users";
import {
  Alert,
  Button,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login({ navigation }) {
  const { setIsSignedIn, setLoggedInUser } = useContext(AuthContext);
  const [loginFn, { data, loading, error }] = useMutation(LOGIN);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-5 bg-[#f3f6f9]">
      <Image
        source={{
          uri: "https://freelogopng.com/images/all_img/1656958733linkedin-logo-png.png",
        }}
        className="w-48 h-48"
        style={{ resizeMode: "contain" }}
      />
      <Text className="text-2xl font-bold mb-2">Sign in</Text>
      <Text className="text-md font-light mb-5">
        Stay updated on your professional world
      </Text>
      <TextInput
        className="w-full p-4 mb-4 rounded border border-[#ddd] bg-white"
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full p-4 mb-4 rounded border border-[#ddd] bg-white"
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        // title={loading ? "Sign in..." : "Sign in"}
        onPress={async () => {
          try {
            console.log({ username, password }, "<<<< username&PasswordLogin");
            const form = {
              username,
              password,
            };
            const result = await loginFn({
              variables: { form },
            });
            console.log(result, "<<<<< resultLogin");

            // localStorage expo
            await SecureStore.setItemAsync(
              "access_token",
              result.data.login.access_token
            );

            await SecureStore.setItemAsync(
              "user_id",
              result.data.login._id
            );

            // Set userData
            const userData = result.data.login
            setLoggedInUser(userData);

            // pindah halaman dengan set isSignedIn dari context
            setIsSignedIn(true);
          } catch (error) {
            console.log(error);
            Alert.alert(
              `Oops!`,
              `${error.message}`,
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: true }
            );
          }
        }}
        className="w-full p-4 bg-[#0077b5] rounded items-center mb-4"
      >
        <Text className="text-white text-lg font-bold">{loading ? "Sign in..." : "Sign in"}</Text>
      </TouchableOpacity>
      <View className="flex-row">
        <Text className="text-black">New to LinkedIn? </Text>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text className="text-[#0077b5] font-bold">Join now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
