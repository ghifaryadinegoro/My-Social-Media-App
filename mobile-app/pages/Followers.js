import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../query/users";

const Followers = ({ route, navigation }) => {
  const { userId } = route.params;

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: {
      userByIdId: userId,
    },
  });

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

  const followers = data.userById.followers || [];

  const renderFollower = ({ item }) => (
    <View className="flex-row items-center p-4 border-b border-gray-200">
      <Image
        source={{
          uri:
            item.profilePicture ||
            "https://img.freepik.com/premium-photo/futuristic-portrait-with-neon-halo-modern_963421-1288.jpg?w=360",
        }}
        className="w-12 h-12 rounded-full"
      />
      <View className="ml-4 flex-1">
        <Text className="font-semibold text-lg">{item.name}</Text>
        <Text className="text-gray-500 text-sm">{item.username}</Text>
        {/* <Text className="text-gray-500 text-xs">{item.email}</Text> */}
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
        className="bg-blue-500 px-4 py-2 rounded-full"
      >
        <Text className="text-white font-bold">View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={followers}
        renderItem={renderFollower}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text className="text-center py-10 text-lg font-medium text-gray-500">
            No followers found.
          </Text>
        }
      />
    </View>
  );
};

export default Followers;
