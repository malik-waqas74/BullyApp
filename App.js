import Screen from './components/Screen';
import TabNavigator from './navigators/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import useFirebase from './hook/useFirebase';
import { AuthNavigator } from './navigators/Navigator';
import CustomLoadingAnimation from './components/CustomLoadingAnimation';

export default function App() {
  const { user,isConnected } = useFirebase();
  if (!isConnected) return <Screen>
   <CustomLoadingAnimation isLoading={!isConnected} />
 </Screen>
  return (
    <Screen>
      <NavigationContainer>
        {user ? <TabNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </Screen>

  );
}