import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function UserListItem({ user, backgroundColor }) {
  return (
    <View style={[styles.itemContainer, { backgroundColor }]}>
      {/* Drug Type Header */}
      <View style={styles.drugHeader}>
        <Text style={styles.drugText}>{user.Drug.toUpperCase()}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Addict's Name */}
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={18} color="#FFF" />
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{user.addict_name}</Text>
        </View>

        {/* Phone Number */}
        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={18} color="#FFF" />
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>

        {/* Reported By */}
        <View style={styles.infoRow}>
          <MaterialIcons name="assignment-ind" size={18} color="#FFF" />
          <Text style={styles.infoLabel}>Reported By:</Text>
          <Text style={styles.infoValue}>{user.reporter_name}</Text>
        </View>

        {/* Additional Notes */}
        {user.additional_note && (
          <View style={styles.noteContainer}>
            <View style={styles.noteHeader}>
              <MaterialIcons name="notes" size={16} color="#FFF" />
              <Text style={styles.noteLabel}>Additional Notes</Text>
            </View>
            <Text style={styles.noteText}>{user.additional_note}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 12,
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  drugHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  drugText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  contentContainer: {
    padding: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
    flex: 1,
  },
  noteContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  noteLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 6,
  },
  noteText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
});