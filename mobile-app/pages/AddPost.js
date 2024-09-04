import { useMutation } from "@apollo/client";
import { useState } from "react";
import {
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ADD_POST, GET_POSTS } from "../query/posts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPost({ navigation }) {
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");

  const [addPostFn, { data, loading, error }] = useMutation(ADD_POST, {
    refetchQueries: [GET_POSTS],
  });

  const handlePost = async () => {
    try {
      const formattedTags = tags.toLowerCase().replace(/\s/g, "").split(",");
      const form = {
        content,
        imgUrl,
        tags: formattedTags,
      };
      await addPostFn({ variables: { form } });

      // After successful post submission
      setContent("");
      setImgUrl("");
      setTags("");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert(
        `Oops!`,
        `${error.message}`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: true }
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/000000/left.png",
              }}
              className="w-8 h-8"
            />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-gray-900">
            Create a Post
          </Text>
        </View>

        {/* Post Content Input */}
        <View className="bg-gray-100 p-4 rounded-xl shadow-md mb-4 border border-gray-200">
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="Share your thoughts..."
            className="text-lg text-gray-800 h-32"
            style={{ textAlignVertical: "top" }} // Align text to the top
          />
        </View>

        {/* Image URL Input */}
        <View className="bg-gray-100 p-4 rounded-xl shadow-md mb-4 border border-gray-200">
          <TextInput
            value={imgUrl}
            onChangeText={setImgUrl}
            placeholder="Image URL (optional)"
            className="text-lg text-gray-800"
          />
        </View>

        {/* Tags Input */}
        <View className="bg-gray-100 p-4 rounded-xl shadow-md mb-6 border border-gray-200">
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="Tags (comma-separated)"
            className="text-lg text-gray-800"
          />
        </View>

        {/* Post Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className={`bg-blue-500 p-4 rounded-lg ${
            loading ? "opacity-50" : ""
          }`}
          onPress={handlePost}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
