import { useMutation, useQuery } from "@apollo/client";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COMMENT, POST_DETAIL } from "../query/posts";
import PostCard from "../components/PostCard";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const PostDetail = ({ navigation, route }) => {
  const { postId } = route.params;
  const [content, setContent] = useState("");

  const {
    data: dataPostDetail,
    loading: loadingPostDetail,
    error: errorPostDetail,
  } = useQuery(POST_DETAIL, {
    variables: { postByIdId: postId },
  });

  const [commentFn, { loading: loadingComment, error: errorComment }] =
    useMutation(COMMENT, {
      refetchQueries: [POST_DETAIL],
    });

  if (loadingPostDetail || loadingComment) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (errorPostDetail || errorComment) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {errorPostDetail?.message || errorComment?.message}</Text>
      </View>
    );
  }

  const post = dataPostDetail?.postById || {};

  const formatTimeDiff = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffMs = now - commentDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);

    if (diffWeek > 0) return `${diffWeek}w`;
    if (diffDay > 0) return `${diffDay}d`;
    if (diffHour > 0) return `${diffHour}h`;
    if (diffMin > 0) return `${diffMin}m`;
    return "Just now";
  };

  const renderComment = ({ item }) => (
    <View className="bg-white">
      <View className="flex-row items-start mb-3 px-4 py-2">
        <Image
          source={{
            uri: "https://img.freepik.com/premium-photo/british-shorthair-cat-softly-swaying-paw_1273914-5085.jpg?w=1060",
          }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="font-semibold text-base">{item.username}</Text>
            <Text className="text-gray-500 text-sm ml-2">
              {formatTimeDiff(item.createdAt)}
            </Text>
          </View>
          <Text className="text-gray-700">{item.content}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f3f6f9]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <FlatList
          data={post.comments || []}
          renderItem={renderComment}
          keyExtractor={(item, index) => `${item.createdAt}-${index}`}
          ListHeaderComponent={
            <>
              <View className="bg-white rounded-lg shadow-md">
                <PostCard post={post} />
              </View>
              <View className="p-4 border-b border-gray-200 bg-white mt-4">
                <Text className="font-semibold text-lg">Comments</Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <Text className="text-center py-10 text-lg font-medium text-gray-500">
              No comments yet.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <View className="p-4 bg-white border-t border-gray-200 flex-row items-center">
          <TextInput
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-gray-100"
            placeholder="Add a comment..."
            multiline
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity
            onPress={async () => {
              try {
                await commentFn({
                  variables: {
                    postId: postId,
                    form: { content: content },
                  },
                });
                setContent("");
              } catch (error) {
                console.log(error, "<<<<< failed to add comment");
              }
            }}
            className="ml-3 rounded-full justify-center items-center"
          >
            <Ionicons name="send-sharp" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetail;
