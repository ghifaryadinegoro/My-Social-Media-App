import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GET_POSTS, LIKE } from "../query/posts";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function PostCard({ post }) {
    console.log(post.tags, "<<<<<<PostTags");
  const [likeFn, { data, loading, error }] = useMutation(LIKE, {
    refetchQueries: [GET_POSTS],
  });

  const navigation = useNavigation();

  const postDate = new Date(post.createdAt);
  const timeDiffMs = new Date() - postDate;

  const formatTimeDiff = (diff) => {
    const diffSec = Math.floor(diff / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffWeek / 4);
    const diffYear = Math.floor(diffMonth / 12);

    if (diffYear > 0) return `${diffYear} years ago`;
    if (diffMonth > 0) return `${diffMonth} months ago`;
    if (diffWeek > 0) return `${diffWeek}w ago`;
    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return "Just now";
  };
  const formattedTimeDiff = formatTimeDiff(timeDiffMs);

  return (
    <View className="bg-white rounded-lg shadow-md">
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100269.jpg?t=st=1724433856~exp=1724437456~hmac=ac869db97126761ce773cd5066d363816aa07cefee4d142d48dc3a20d972ffe5&w=740",
            }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="font-semibold text-base text-start">
              {post.author.name}
            </Text>
            <Text className="text-gray-500 text-xs">{formattedTimeDiff}</Text>
          </View>
        </View>
      </View>
      <View className="px-4 py-2">
        <Text className="text-gray-700 text-base">{post.content}</Text>
        {post.tags.length > 0 && post.tags[0] !== "" && (
          <Text className="text-blue-500 font-bold mt-2 text-base">
            #{post.tags.join(" #")}
          </Text>
        )}
        {post.imgUrl && (
          <Image
            source={{ uri: post.imgUrl }}
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
              {post.likes === null ? 0 : post.likes.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PostDetail", {
                postId: post._id,
              });
            }}
            className="flex-row items-center"
          >
            <Text className="text-gray-500">
              {post.comments === null ? 0 : post.comments.length} comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row py-2 px-20 border-t border-gray-200 justify-between">
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={async () => {
            try {
              const result = await likeFn({
                variables: {
                  postId: post._id,
                },
              });
              // console.log(result, "<<<< resLikes");
            } catch (error) {
              console.log(error);
            }
          }}
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
          onPress={() => {
            navigation.navigate("PostDetail", {
              postId: post._id,
            });
          }}
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
  );
}

const styles = StyleSheet.create({
  postImage: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 4,
  },
});
