import { useChat } from '@/hooks/useChat';
import { useRouter } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatsTab = () => {
  const router = useRouter();
  const { data: chats, isLoading, error } = useChat();

  if (isLoading) {
    return (
      <View className='flex-1 bg-slate-500 items-center justify-center'>
        <ActivityIndicator size={"large"} color={"#F4A261"} />
      </View>
    )
  }

  return (
    <SafeAreaView className='bg-white flex-1'>
      <Text className='text-black'>ChatsTab</Text>
    </SafeAreaView>
  )
}

export default ChatsTab