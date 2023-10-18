import Home from './Contact-app-view/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UpdateContact from './Contact-app-view/UpdateContact';
import AddContact from './Contact-app-view/AddContact';
import Favorite from './Contact-app-view/FavoriteContact';
import ViewContact from './Contact-app-view/ViewContact';
import {StyleSheet, View} from 'react-native'

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
   
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomeScreen' >
  
        <Stack.Screen name="List of contacts" component={Home} />
        <Stack.Screen name="updateContact" component={UpdateContact}/>
        <Stack.Screen name="addContact" component={AddContact} />
        <Stack.Screen name='favoriteContact' component={Favorite}/>
        <Stack.Screen name='view contact' component={ViewContact} />
     
      </Stack.Navigator>
    </NavigationContainer>
  );
}

