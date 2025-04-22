import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/superbase";
import UserListItem from "@/components/UserListItem";

const colors = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("addict")
          .select("reporter_name, addict_name, phone, additional_note, Drug, reported_by");

        if (error) throw new Error(error.message);
        setUsers(data || []);
      } catch (error: any) {
        Alert.alert("Error", "Failed to fetch users: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item, index }) => (
          <UserListItem
            user={item}
            backgroundColor={colors[index % colors.length]} // Cycle colors for variety
          />
        )}
        keyExtractor={(item, index) =>
          `${item?.addict_name ?? 'user'}-${index}` // Safe key
        }
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
}

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
