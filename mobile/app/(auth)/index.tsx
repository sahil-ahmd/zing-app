import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import useSocialAuth from "@/hooks/useSocialAuth";

const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();

  return (
    <View className="bg-black flex-1">
      <SafeAreaView className="flex-1 items-center justify-center">
        {/** Images */}
        <View className="absolute -right-20 top-[15%]">
          <Image
            source={require("../../assets/images/zigzag.png")}
            contentFit="contain"
            style={{ width: 200, height: 200 }}
          />
        </View>
        <View className="absolute -left-20 top-[5%]">
          <Image
            source={require("../../assets/images/zigzag-l.png")}
            contentFit="contain"
            style={{ width: 200, height: 200 }}
          />
        </View>

        <View className="">
          <Text className="text-white text-4xl font-medium">Welcome To <Text className="text-[#E2D5FE] font-semibold">Zing!</Text></Text>
          <Text className="text-white font-normal mt-3 text-xl text-center">
            Your Chats Await ...
          </Text>
        </View>

        {/** Auth Buttons */}
        <View className="flex-col gap-4 absolute bottom-10 w-full items-center justify-center mx-auto">
          <Pressable
            className="flex-1 flex-row items-center justify-center w-[80%] gap-2 bg-white/80 py-3 rounded-xl active:scale-[0.97]"
            disabled={loadingStrategy === "oauth_google"}
            onPress={() => handleSocialAuth("oauth_google")}
          >
            {loadingStrategy === "oauth_google" ? (
              <ActivityIndicator size="small" color="#1a1a1a" />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
                <Text className="font-medium">Google</Text>
              </>
            )}
          </Pressable>
          <Pressable
            className="flex-1 flex-row items-center justify-center w-[80%] gap-2 bg-neutral-800 py-3 rounded-xl active:scale-[0.97]"
            disabled={loadingStrategy === "oauth_apple"}
            onPress={() => handleSocialAuth("oauth_apple")}
          >
            {loadingStrategy === "oauth_apple" ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                <Text className="text-white font-medium">Apple</Text>
              </>
            )}
          </Pressable>
          <Text className="text-neutral-400 text-center mt-2 border-b border-neutral-400 text-sm">
            Sign in to continue your conversation
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
