import { Text, View, Pressable, ScrollView, NativeModules, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import apiGetCall from '../services/apiCall';
import useAppState from '../services/useAppState';
import { setMoneyFormat } from '../utils/utils';
import styles from './HomeScreen.styles';

interface Dolar {
  nombre: string;
  compra: number;
  venta: number;
}

const CustomNativeDollarView = NativeModules?.DolarCheckWidget;


console.log("HomeScreen rendered before");

export default function HomeScreen() {

    const [dolars, setDolars] = useState<Dolar[]>([]); 
    const [countClicks, setCounterClicks] = useState(0); 
    const appState = useAppState();
      
    //TODO: return every 5 minutes
      const fetchDolarQuote = async () => {
        try{
            const data = await apiGetCall("https://dolarapi.com/v1/dolares") 
            setDolars(data);
            
        }catch(error){
          console.error("Error fetching data:", error);
        }
    
      }
    
      const getCheckCountLocal = async () => {
        //get counts from native module
        try {
        const thisCount = await CustomNativeDollarView?.getCheckCount();
    
        setCounterClicks(thisCount);
        }catch(error){
            console.warn("Error getting count from native module:", error);
        }
      };
    
      const sendPriceToWidget = async (price:number|string) => {
        try {
          await CustomNativeDollarView?.dataToShow(`${price}`);

        } catch (error) {
          console.error("Error sending price to widget:", error);
        }
      }
    
      useEffect(() => {
        fetchDolarQuote(); 
      }, []);
    
      useEffect(() => {
        // refresh the widget counter every time the app comes back to the foreground
        if (appState === 'active') {
          getCheckCountLocal();
        }
      }, [appState]);
    
      useEffect(() => {
        if (dolars?.length > 0) {
          // if data is not empty, send it to the native module
          //TODO: mandar el objeto, no solo 1 string
          const price = dolars?.[0].compra;
          sendPriceToWidget(price);
        }
      }, [dolars]);
    

    return (
    <SafeAreaView style={{ flex: 1 }}>      
          <View style={styles.container}>
      <Text style={[styles.cardTitle, {textAlign: 'center'}]}>counter: {countClicks}</Text>
      <Pressable onPress={() => {
        getCheckCountLocal();
      }}>
        <Text style={[styles.cardTitle, {textAlign: 'center', color: 'blue'}]}>Get counter from Widget</Text>
      </Pressable>


      <Pressable onPress={() => {
        sendPriceToWidget(dolars[0].compra);
      }}>
        <Text style={[styles.cardTitle, {textAlign: 'center', color: 'blue'}]}>Send to widget</Text>
      </Pressable>

      <ScrollView style={{marginTop: 10}}>
      {dolars?.map((dolar, index) => (
        <View style={styles.row} key={index}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{dolar.nombre}</Text>
            <View style={styles.cardContent}>
                <View style={styles.dataItem}>
                  <Text style={styles.label}>Lo vendo a</Text>
                  <Text style={[styles.value, styles.incoming]}>{setMoneyFormat(dolar.compra)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.dataItem}>
                  <Text style={styles.label}>Me lo venden</Text>
                  <Text style={[styles.value, styles.outgoing]}>{setMoneyFormat(dolar.venta)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.dataItem}>
                  <Text style={styles.label}>Media</Text>
                  <Text style={[styles.value, styles.media]}>{setMoneyFormat((dolar.venta + dolar.compra)/2)}</Text>
                </View>
              </View>
            </View>
          </View>

      ))}
      </ScrollView>
      
    </View>
    <StatusBar />
    </SafeAreaView>);
}