import Header from '@/components/Header'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const CommunityTab = () => {
  return (
    <View className="px-5 py-4 mt-10 w-full bg-white flex-1">
      <Header title="Communities" iconName="people-outline" route="/new-chat" />
    </View>
  )
}

export default CommunityTab