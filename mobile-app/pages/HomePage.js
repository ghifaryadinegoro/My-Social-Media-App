import { useQuery } from "@apollo/client";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { GET_POSTS } from "../query/posts";
import PostCard from "../components/PostCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddPost from "./AddPost";
import Profile from "./MyProfile";
import SearchUsers from "./SearchUsers";
import { SafeAreaView } from "react-native-safe-area-context";

// const posts = [
//   {
//     id: "1",
//     name: "John Doe",
//     content: "Just joined LinkedIn! Excited to connect with everyone.",
//     image: "https://via.placeholder.com/600x300?text=Welcome+Image",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     content: "Great day at work today! Met with some amazing clients.",
//     image: "https://via.placeholder.com/600x300?text=Work+Day+Image",
//   },
// ];

const HomePage = ({ navigation }) => {
  // console.log(navigation, "<<<<<< navigationHomepage");

  const { data, loading, error } = useQuery(GET_POSTS);

  // console.log(data, "<<<<<<<< data", loading ,"<<<< loading", error, "<<< error" );

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-[#f3f6f9]">
      <View className="bg-white p-4 border-b border-gray-200 shadow-md flex-row items-center">
        <Pressable
          onPress={() => {
            navigation.navigate(Profile);
          }}
        >
          <Image
            source={{
              uri: "https://img.freepik.com/premium-photo/scene-showing-man-hoodie-with-glowing-eyes_869640-457445.jpg?w=740",
            }}
            className="w-10 h-10 rounded-full"
          />
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate(SearchUsers);
          }}
          className="flex-1 mx-4 relative"
        >
          <View className="h-10 border border-gray-300 rounded-lg bg-[#edf3f8]">
            <Text className="pt-2 px-4 text-gray-400">🔍 Search users...</Text>
          </View>
        </Pressable>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate(AddPost);
          }}
          className="p-1 bg-gray-600 rounded-lg"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data.posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 8 }}
        renderItem={(props) => {
          return (
            <Pressable
              onPress={() => {
                navigation.navigate("PostDetail", {
                  postId: props.item._id,
                });
              }}
              className="bg-white rounded-lg shadow-md mb-4"
            >
              <PostCard post={props.item} />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postImage: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 4,
  },
});

export default HomePage;
