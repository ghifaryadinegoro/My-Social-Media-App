import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_USER, SEARCH_USERS } from "../query/users";
import { FOLLOW, GET_FOLLOWS } from "../query/follows";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

export default function SearchUsers({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [following, setFollowing] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Fetch the logged-in user's ID from SecureStore
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync("user_id");
      setLoggedInUserId(userId);
      console.log(userId, "<<<<<<<< loggedInUserId After fetching");
    };
    fetchUserId();
  }, []);

  // Fetch follows data
  const { data: followsData, loading: followsLoading } = useQuery(GET_FOLLOWS);

  const [searchFn, { data, loading, error }] = useLazyQuery(SEARCH_USERS);

  const [followUser, { loading: followLoading }] = useMutation(FOLLOW, {
    refetchQueries: [GET_FOLLOWS, GET_USER],
    onCompleted: () => {
      console.log("Successfully followed/unfollowed user");
    },
  });

  // Map following data
  useEffect(() => {
    if (followsData && loggedInUserId) {
      const followMap = followsData.follows.reduce((acc, follow) => {
        if (follow.followerId === loggedInUserId) {
          acc[follow.followingId] = true;
        }
        return acc;
      }, {});
      setFollowing(followMap);
    }
  }, [followsData, loggedInUserId]);

  // Handle follow/unfollow action
  const handleFollow = async (userId) => {
    try {
      const isFollowing = following[userId] || false;

      const { data } = await followUser({ variables: { followingId: userId } });

      if (
        data.addFollow === "success follow user" ||
        data.addFollow === "Success unfollow this user"
      ) {
        setFollowing((prev) => ({
          ...prev,
          [userId]: !isFollowing,
        }));
      }
    } catch (error) {
      console.log("Failed to update follow status:", error.message);
    }
  };

  // Render each user item in the list
  const renderUser = ({ item }) => {
    const isFollowing = following[item._id];
    const isCurrentUser = item._id === loggedInUserId;

    return (
      <TouchableOpacity
      activeOpacity={0.6}
        className="flex-row items-center p-4 border-b border-gray-200"
        onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
      >
        <Image
          source={{
            uri:
              item.profilePicture ||
              "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100269.jpg?t=st=1724433856~exp=1724437456~hmac=ac869db97126761ce773cd5066d363816aa07cefee4d142d48dc3a20d972ffe5&w=740",
          }}
          className="w-12 h-12 rounded-full"
        />
        <View className="ml-4 flex-1">
          <Text className="font-semibold text-lg">{item.name}</Text>
          <Text className="text-gray-500 text-sm">{item.username}</Text>
        </View>
        {!isCurrentUser && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleFollow(item._id)}
            className={`ml-4 px-4 py-2 rounded-full flex-row ${
              isFollowing ? "bg-blue-500" : "bg-gray-400"
            }`}
            disabled={followLoading}
          >
            <Text className={`text-white ${isFollowing ? "font-bold" : ""}`}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // Loading and error handling
  if (loading || followsLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error.message}</Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 bg-white border-b border-gray-200 flex-row items-center">
        <TextInput
          className="h-12 border border-gray-300 rounded-lg px-4 bg-[#edf3f8] text-base flex-1"
          placeholder="🔍 Search users..."
          placeholderTextColor="#888"
          value={keyword}
          onChangeText={setKeyword}
        />
        <TouchableOpacity
          onPress={async () => {
            try {
              await searchFn({ variables: { keyword } });
            } catch (error) {
              console.log(error);
              Alert.alert(
                "Oops!",
                `${error.message}`,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: true }
              );
            }
          }}
          className="ml-4 px-4 py-2 bg-blue-500 rounded-lg"
          disabled={loading}
        >
          <Text className="text-white font-semibold">Search</Text>
        </TouchableOpacity>
      </View>
      {data?.searchUsers.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-semibold text-gray-600">
            User not found
          </Text>
        </View>
      )}
      <FlatList
        data={data?.searchUsers || []}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
}
