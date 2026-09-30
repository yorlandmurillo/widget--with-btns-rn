import { NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

function App() {
  
  console.log("appscren rendered");

  return (
    <NavigationContainer>
            <Stack.Navigator
                initialRouteName={"HomeScreen"}
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                }}>


                <Stack.Screen 
                  name="HomeScreen" 
                  component={HomeScreen} 
                />
                </Stack.Navigator>
            </NavigationContainer>
  );
}

export default App;