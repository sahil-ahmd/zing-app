import { useAuth } from '@clerk/clerk-expo'
import { View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileTab = () => {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className='bg-white flex-1'>
      <Text className='text-black'>Profile Tab</Text>
      <Pressable
        onPress={() => signOut()}
        className='mt-4 bg-zinc-800 px-4 py-4'
      >
        <Text className='text-white'>Sign out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default ProfileTab