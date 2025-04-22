import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { useEffect, useState } from "react";
import { PieChart } from 'react-native-svg-charts';
import { supabase } from "../lib/superbase";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import History from "./Drawer_Screens/History";
import Map from "./Drawer_Screens/Map";
import StaffList from "./Drawer_Screens/StaffList";

const Drawer = createDrawerNavigator();

type DataType = {
  Drug: string;
  value: number;
};

function index() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#8BC34A' },
        drawerLabelStyle: { color: "#3D8D7A", fontSize: 16, fontWeight: "bold" },
        drawerActiveTintColor: "#2e7d32",
        drawerInactiveTintColor: "#A3D1C6",
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="UserList" component={History} />
      <Drawer.Screen name="Map" component={Map} />
      <Drawer.Screen name="StaffList" component={StaffList} />
    </Drawer.Navigator>
  );
}

const HomeScreen = () => {
  const [cases, setCases] = useState<DataType[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [drugCounts, setDrugCounts] = useState<Record<string, number>>({});
  const colors = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];

  // Fetch cases from Supabase
  const fetchCases = async () => {
    const { data, error } = await supabase.from('addict').select('*');
    if (error) {
      console.error("Fetch Error:", error);
    } else {
      setCases(data);
      setTotalCases(data.length);
      countDrugs(data);
    }
  };

  // Count drug occurrences
  const countDrugs = (data: { Drug?: string }[]) => {
    const counts: Record<string, number> = {};
    data.forEach(({ Drug }) => {
      if (Drug) {
        counts[Drug] = (counts[Drug] || 0) + 1;
      }
    });
    setDrugCounts(counts);
  };

  // Initial load + realtime updates
  useEffect(() => {
    fetchCases(); // Initial fetch

    const subscription = supabase
      .channel('realtime:addict')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'addict' },
        (payload) => {
          console.log("Table changed:", payload);
          fetchCases(); // Refetch when data changes
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Pie data setup
  const pieData = Object.keys(drugCounts).map((key, index) => ({
    key,
    value: drugCounts[key],
    svg: { fill: colors[index % colors.length] },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Cases</Text>
      <View style={styles.chartContainer}>
        <PieChart style={styles.chart} data={pieData} />
        <Text style={styles.totalText}>{totalCases}</Text>
      </View>
      <View style={styles.legend}>
        {Object.keys(drugCounts).map((drug, index) => (
          <Text key={drug} style={[styles.legendText, { color: colors[index % colors.length] }]}>
            {drug}: {drugCounts[drug]}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  chartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chart: {
    aspectRatio: 1,
    flexShrink: 1,
    maxWidth: "70%",
  },
  totalText: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  legend: {
    marginTop: 20,
  },
  legendText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default index;
