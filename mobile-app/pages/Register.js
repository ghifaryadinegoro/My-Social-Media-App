import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { REGISTER } from "../query/users";
import { useMutation } from "@apollo/client";
import { useState } from "react";

const Register = ({ navigation }) => {
  const [registerFn, { data, loading, error }] = useMutation(REGISTER);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
      <Text className="text-2xl font-bold mb-6">Create an Account</Text>
      <TextInput
        className="w-full p-4 mb-4 rounded border border-[#ddd] bg-white"
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-full p-4 mb-4 rounded border border-[#ddd] bg-white"
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full p-4 mb-4 rounded border border-[#ddd] bg-white"
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full p-4 mb-4 rounded border border-[#ddd] bg-white"
        placeholder="Password (5 or more characters)"
        placeholderTextColor="#888"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={async () => {
          try {
            console.log(
              { name, username, email, password },
              "<<<< RegisterForm"
            );
            const form = {
              name,
              username,
              email,
              password,
            };
            const result = await registerFn({
              variables: { form },
            });
            console.log(result, "<<<<< resultRegister");

            // pindah halaman ke login
            navigation.navigate("Login");
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
        <Text className="text-white text-lg font-bold">
          {loading ? "Register..." : "Register"}
        </Text>
      </TouchableOpacity>
      <View className="flex-row">
        <Text className="text-black">Already have an account?</Text>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text className="text-[#0077b5] font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Register;
