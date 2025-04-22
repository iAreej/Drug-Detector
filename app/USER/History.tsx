import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/superbase";
import { useUser } from "../Provider/UserProvider";
import CasesList from "@/components/CaseListItem";

const colors = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];

export default function UserList() {
  const { userId } = useUser();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from("addict")
        .select("addict_name, phone, additional_note, Drug, CNIC")
        .eq('reported_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch cases: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCases();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'addict',
          filter: `reported_by=eq.${userId}`
        },
        (payload) => {
          // Refresh data when any change occurs
          fetchCases();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#82A878" />
        <Text style={styles.loadingText}>Loading cases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CasesList cases={cases} />
    </View>
  );
}

// Keep your existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors[1],
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});