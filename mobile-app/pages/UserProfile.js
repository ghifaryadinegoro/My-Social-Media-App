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
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import YoutubeIframe from "react-native-youtube-iframe";

const UserProfile = ({ navigation, route }) => {
  const { userId } = route.params;
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: {
      userByIdId: userId,
    },
  });

  // video layout config
  const [videoContainerHeight, setVideoContainerHeight] = useState(200);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setVideoContainerHeight(height);
  };

  // console.log(data, "<<<<<<<< dataUserProfile");

  useEffect(() => {
    const refetchUserData = navigation.addListener("focus", () => {
      refetch();
    });
    return refetchUserData;
  }, [navigation, refetch]);

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

  const user = data.userById;

  console.log(user, "<<<<< userUserProfile");

  const posts = [
    {
      _id: "1",
      content: "Checkout my fingerstyle cover of Everglow by Coldplay! 🎸🔥🔥",
      // imgUrl:
      //   "https://img.freepik.com/premium-photo/man-playing-guitar-with-blurred-background_1051578-178570.jpg?w=1060",
      videoUrl: "IxhJ0kBaYLg",
      tags: ["guitar", "fingerstyle", "chilling"],
      likes: ["user1"],
      comments: ["user1", "user2"],
    },
    {
      _id: "2",
      content: "Beautiful scenery from Switzerland. ✈️🌍",
      imgUrl:
        "https://img.freepik.com/free-photo/santa-maddalena-dolomites-rangesouth-tyrol_661209-237.jpg?t=st=1724558075~exp=1724561675~hmac=584ba5b72ddad62c8208779e2ea80156257bb8bdff0ea1f755a7779d2b7cf31e&w=900",
      // videoUrl: "",
      tags: ["traveling", "holiday"],
      likes: ["user1", "user2", "user3"],
      comments: ["user1", "user2", "user3"],
    },
    {
      _id: "3",
      content:
        "INSANE cover of Sparkle - (Your Name OST) スパークル - Fingerstyle Guitar Cover by Edward Ong",
      // imgUrl:
      //   "",
      videoUrl: "w-tYngyVXLM",
      tags: ["yourName", "fingerstyle", "anime"],
      likes: ["user1", "user2", "user3"],
      comments: ["user1", "user2", "user3"],
    },
    {
      _id: "4",
      content:
        "Gotye - Somebody that I used to know | Acoustic guitar fingerstyle cover by Eiro Nareth",
      // imgUrl:
      //   "",
      videoUrl: "X9x87dguFHw",
      tags: ["gotye", "fingerstyle"],
      likes: ["user1", "user2"],
      comments: ["user1", "user2"],
    },
    {
      _id: "5",
      content:
        "Iris - Goo Goo Dolls | Fingerstyle Guitar | TAB + Chords + Lyrics",
      // imgUrl:
      //   "",
      videoUrl: "Iajl5VSbFZI",
      tags: ["iris", "GooGooDolls​", "吉他譜"],
      likes: ["user1", "user2"],
      comments: ["user1", "user2"],
    },
  ];

  const renderHeader = () => (
    <View className="bg-white mb-4">
      <Image
        source={{
          uri: "https://img.freepik.com/premium-photo/fiery-3d-cgi-explosion-blast-concept-design-with-rectangular-dark-blue-rods-bright-flame_1180651-6869.jpg?w=1060",
        }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="absolute left-4 top-32">
        <Image
          source={{
            uri: "https://img.freepik.com/premium-photo/futuristic-portrait-with-neon-halo-modern_963421-1288.jpg?w=360",
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
                    uri: "https://img.freepik.com/premium-photo/futuristic-portrait-with-neon-halo-modern_963421-1288.jpg?w=360",
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
              {item.videoUrl && (
                <View
                  style={[
                    styles.videoContainer,
                    { height: videoContainerHeight },
                  ]} onLayout={handleLayout}
                >
                  <YoutubeIframe
                    videoId={item.videoUrl}
                    height="100%"
                    width="100%"
                    play={false}
                    controls={1}
                    fullscreen={true}
                  />
                </View>
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
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden"
  },
});

export default UserProfile;
