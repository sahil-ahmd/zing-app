import { Redirect } from 'expo-router';
import { View, Text } from 'react-native'

const AuthLayout = () => {
  const isAuth = true;
  if (isAuth) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <View>
      <Text>AuthLayout</Text>
    </View>
  )
}

export default AuthLayout