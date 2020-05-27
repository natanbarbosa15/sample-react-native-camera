import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const AppStack = createStackNavigator();

import Main from './pages/main';
import Camera from './pages/camera';

export default function Routes() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {backgroundColor: '#DA552F'},
          headerTintColor: '#FFF',
        }}>
        <AppStack.Screen name="Menu" component={Main} />
        <AppStack.Screen
          name="Camera"
          component={Camera}
          options={{
            title: 'Câmera',
          }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
