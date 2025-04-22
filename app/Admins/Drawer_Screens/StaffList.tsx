import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import StaffListItem from '@/components/StaffListItem';
import { supabase } from "@/app/lib/superbase"; // Import your Supabase client


export default function StaffList() {
  const [users, setUsers] = useState([]);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('group', 'User');

    if (error) {
      console.error('Error fetching users:', error.message);
    } else {
      setUsers(data);
    }
  };

  // Handle delete in the parent and pass it to the child
  const deleteUser = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      Alert.alert('Error', 'Failed to delete user');
      console.error('Error deleting user:', error.message);
    } else {
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers(); // Refresh the list after deletion
    }
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <StaffListItem users={users} onDelete={deleteUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 12,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
});


