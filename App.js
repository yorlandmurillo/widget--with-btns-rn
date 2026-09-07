import { StatusBar } from 'expo-status-bar';
// import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, NativeModules, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import apiGetCall from './services/apiCall';
import { setMoneyFormat } from './utils/utils';


const CustomNativeDollarView = NativeModules.DolarCheckWidget;


export default function App() {
  
  const [dolars, setDolars] = useState([]); 
  const [countClicks, setCounterClicks] = useState(0); 
  // const isFocused = useIsFocused();
  
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
    const thisCount = await CustomNativeDollarView?.getCheckCount();

    console.log("Count from native module:", thisCount);
    setCounterClicks(thisCount);
  };

  const sendPriceToWidget = async (price) => {
    try {
      // await CustomNativeDollarView?.dataToShow(price);
      CustomNativeDollarView?.dataToShow( `${price}` );
    } catch (error) {
      console.error("Error sending price to widget:", error);
    }
  }

  useEffect(() => {
    fetchDolarQuote(); 
  }, []);

  useEffect(() => {
    getCheckCountLocal();
  }, []);




  useEffect(() => {
    if (dolars.length > 0) {
      // if data is not empty, send it to the native module
      //TODO: mandar el objeto, no solo 1 string
      const price = dolars[0].compra;
      CustomNativeDollarView?.dataToShow(`${price}` );
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
      {dolars.map((dolar, index) => (
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
      <StatusBar style="auto" />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    // paddingTop: 16,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 35,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  label: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
  },
  incoming: {
    color: '#10b981',
  },
  outgoing: {
    color: '#ef4444',
  },
  media: {
    color: 'orange',
  },
});
