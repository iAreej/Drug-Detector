import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StaffListItem = ({ users, onDelete }) => {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <MaterialIcons name="person" size={24} color="#4CAF50" style={styles.icon} />
            <View>
              <Text style={styles.userName}>{item.username}</Text>
              {item.email && <Text style={styles.userEmail}>{item.email}</Text>}
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
          >
            <MaterialIcons name="delete-outline" size={24} color="#ef5350" />
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <MaterialIcons name="group-off" size={40} color="#4CAF50" />
          <Text style={styles.emptyText}>No staff members found</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop:10,
    
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export default StaffListItem;