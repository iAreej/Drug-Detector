import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { PieChart } from 'react-native-svg-charts';
import { useResponse } from "../Provider/ResProvider";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');
const chartSize = width * 0.8;

export default function InputPage() {
  const { setItem } = useResponse();
  const [inputData, setInputData] = useState(new Array(8).fill(1));
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const baseURL = 'http://192.168.0.194:5000';
  
  const pollingInterval = useRef(null); // Store interval ID

  const colors = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#d2691e', '#008b8b', '#673AB7'];
  const chemicalLabels = ['MS-1100', 'MG-811', 'MQ-137', 'TGS 1820', 'MQ-6', 'TGS 822', 'TGS 2616', 'TGS 6810-D00'];

  const pieData = chemicalLabels.map((label, index) => ({
    key: label,
    value: inputData[index] || 0,
    svg: { fill: colors[index] },
    label,
  }));

  useEffect(() => {
    
    let isMounted = true;

    const fetchUpdatedData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/get_data`);
        if (isMounted) {
          const { composition, predicted_drug } = response.data;
          if (Array.isArray(composition) && composition.length >= 8) {
            setInputData(composition.slice(0, 8));
          } else {
            console.warn("Unexpected composition data:", composition);
          }
          setItem(predicted_drug);
        }
      } catch (error) {
        console.error("Error fetching updated data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUpdatedData(); // Initial fetch
    pollingInterval.current = setInterval(fetchUpdatedData, 3000); // Poll every 3 sec

    return () => {
      isMounted = false;
      clearInterval(pollingInterval.current);
    };
  }, []);

  const Analyze = () => {

    clearInterval(pollingInterval.current); // Stop fetching data
    router.push('./outputPage'); // Navigate to output page

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chemical Analysis</Text>

      <View style={styles.chartWrapper}>
        <PieChart
          style={styles.chart}
          data={pieData}
          innerRadius={'50%'}
          padAngle={0.02}
        />
      </View>

      <View style={styles.legendContainer}>
        {pieData.map((item, index) => (
          <LegendItem key={index} color={colors[index]} {...item} />
        ))}
      </View>

      {loading && <Text style={styles.loadingText}>Fetching data...</Text>}

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={Analyze}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const LegendItem = ({ color, label, value }) => (
  <View style={styles.legendItem}>
    <View style={[styles.colorDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
    <Text style={styles.legendValue}>{value.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: '#E8F5E9', 
    padding: 12 },
  title: { fontSize: 20, 
    fontWeight: '600',
     color: '#2E7D32', 
     textAlign: 'center', 
     marginVertical: 8 },
  chartWrapper: { height: chartSize,
     width: chartSize, 
     alignSelf: 'center', 
     marginTop: 10 },
  chart: { flex: 1 },
  legendContainer: { marginTop: 15 },

  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
     marginVertical: 4,
      paddingHorizontal: 6 },

  colorDot: 
  { width: 10,
    height: 10,
    borderRadius: 5, 
    marginRight: 6 },
  legendLabel: { fontSize: 12, color: '#2E7D32', flex: 1, marginRight: 4 },
  legendValue: { fontSize: 12, fontWeight: '600', color: '#2E7D32', minWidth: 40, textAlign: 'right' },
  buttonWrapper: { marginTop: 'auto', paddingVertical: 12 },
  button: { backgroundColor: "rgb(26, 143, 116)",
     paddingVertical: 14, borderRadius: 8, marginHorizontal: 20, elevation: 3 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "600", textAlign: 'center' },
  loadingText: { textAlign: 'center', color: '#FF9800', fontSize: 14, marginTop: 10 },
});

