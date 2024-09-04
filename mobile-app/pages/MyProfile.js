import { useQuery } from "@apollo/client";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { GET_USER } from "../query/users";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

const MyProfile = ({ navigation }) => {
  const { loggedInUser } = useContext(AuthContext);
  console.log(loggedInUser, "<<<<<<, loggedInUser");

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: {
      userByIdId: loggedInUser?._id || "",
    },
  });

  // useEffect(() => {
  //   const refetchUserData = navigation.addListener("focus", () => {
  //     refetch();
  //   });
  //   return refetchUserData;
  // }, [navigation, refetch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f3f6f9]">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f3f6f9]">
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  console.log(data, "<<<<<<<< dataMyProfile");

  const user = data.userById;

  const posts = [
    {
      _id: "1",
      content: "Excited to start a new project at TechCorp!",
      imgUrl:
        "https://img.freepik.com/free-photo/view-futuristic-urban-city_23-2150842818.jpg?t=st=1724434718~exp=1724438318~hmac=d0cd73bbea53d405e41eefd736af493f1f4313a02cc8f07e58fc87a4009a0200&w=996",
      tags: ["work", "job"],
      likes: ["user1"],
      comments: ["user1", "user2"],
    },
    {
      _id: "2",
      content: "Check out my latest article on tech trends.",
      imgUrl:
        "https://img.freepik.com/free-vector/newspaper-design-template_1284-18580.jpg?t=st=1724558483~exp=1724562083~hmac=b0975bd430940603abd876fb21239e9dd44d551e868d7a096cff8e11ad76584c&w=996",
      tags: ["tech", "innovation", "improvement"],
      likes: ["user1", "user2", "user3"],
      comments: ["user1", "user2", "user3"],
    },
  ];

  const renderHeader = () => (
    <View className="bg-white mb-4">
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/cyberpunk-illustration-with-neon-colors-futuristic-technology_23-2151672007.jpg?t=st=1724467027~exp=1724470627~hmac=41955f5b1d4d6c49e9f00138e10103e541eddc358d5fd67507245a9b500bc6e9&w=826",
        }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="absolute left-4 top-32">
        <Image
          source={{
            uri: "https://img.freepik.com/premium-photo/scene-showing-man-hoodie-with-glowing-eyes_869640-457445.jpg?w=740",
          }}
          className="w-24 h-24 rounded-full border-4 border-white"
        />
      </View>
      <View className="pt-10 px-4">
        <Text className="text-2xl font-bold">{user.user.name}</Text>
        <Text className="text-lg text-gray-700">@{user.user.username}</Text>
        <Text className="text-gray-600 mt-2">
          Passionate software engineer with 5+ years of experience in building
          scalable web applications. Enjoys collaborating on innovative
          projects.
        </Text>
      </View>
      <View className="px-4 mx-4 my-2 border-y border-gray-200 bg-white">
        <View className="flex-row justify-between py-2">
          <TouchableOpacity
            activeOpacity={0.4}
            className="flex-1 items-center"
            onPress={() =>
              navigation.navigate("Following", { userId: user.user._id })
            }
          >
            <Text className="text-lg font-semibold">
              {!user.followings ? 0 : user.followings.length}
            </Text>
            <Text className="text-gray-500">Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.4}
            className="flex-1 items-center"
            onPress={() =>
              navigation.navigate("Followers", { userId: user.user._id })
            }
          >
            <Text className="text-lg font-semibold">
              {!user.followers ? 0 : user.followers.length}
            </Text>
            <Text className="text-gray-500">Followers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        // <View className="px-4 bg-white">
        //   <Text className="font-semibold text-xl mb-3">Posts</Text>
        //   <View className="bg-white rounded-lg shadow-lg mb-4">
        //     <View className="px-4 py-2">
        //       <Text className="text-gray-700 text-base mb-2">
        //         {item.content}
        //       </Text>
        //       {item.image && (
        //         <Image
        //           source={{ uri: item.image }}
        //           className="w-full h-48 mt-2 rounded-md"
        //           resizeMode="contain"
        //         />
        //       )}
        //     </View>
        //   </View>
        // </View>

        // Dummy Data
        <View className="bg-white rounded-lg shadow-md mb-4">
          <View className="bg-white rounded-lg shadow-md">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: "https://img.freepik.com/premium-photo/scene-showing-man-hoodie-with-glowing-eyes_869640-457445.jpg?w=740",
                  }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View>
                  <Text className="font-semibold text-base text-start">
                    {user.user.name}
                  </Text>
                  <Text className="text-gray-500 text-xs">2h ago</Text>
                </View>
              </View>
            </View>
            <View className="px-4 py-2">
              <Text className="text-gray-700 text-base">{item.content}</Text>
              {item.tags.length > 0 && item.tags[0] !== "" && (
                <Text className="text-blue-500 font-bold mt-2 text-base">
                  #{item.tags.join(" #")}
                </Text>
              )}
              {item.imgUrl && (
                <Image
                  source={{ uri: item.imgUrl }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}
              <View className="flex-row pt-2 justify-between">
                <View className="flex-row items-center">
                  <View>
                    <Ionicons name="heart-circle" size={20} color="#da2d2d" />
                  </View>
                  <Text className="text-gray-500">
                    {" "}
                    {item.likes === null ? 0 : item.likes.length}
                  </Text>
                </View>
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-gray-500">
                    {item.comments === null ? 0 : item.comments.length} comments
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row py-2 px-20 border-t border-gray-200 justify-between">
              <TouchableOpacity
                activeOpacity={0.6}
                className="flex-col items-center"
              >
                <View>
                  <AntDesign name="like2" size={24} color="black" />
                </View>
                {loading && <ActivityIndicator size="small" color="black" />}
                {!loading && (
                  <Text className="text-gray-600 font-semibold">Like</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                className="flex-col items-center"
              >
                <View>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color="black"
                  />
                </View>
                <Text className="text-gray-500 font-semibold">Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{ backgroundColor: "#f3f6f9" }}
    />
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

export default MyProfile;
