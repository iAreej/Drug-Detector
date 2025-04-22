import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// CNIC formatting function
const formatCNIC = (cnic) => {
  if (!cnic) return 'CNIC Not Available';
  const cleaned = cnic.toString().replace(/\D/g, '');
  return cleaned.match(/.{1,5}/g)?.join('-') || cleaned;
};

const CaseListItem = ({ caseItem }) => (
  <TouchableOpacity 
    style={styles.itemContainer}
    activeOpacity={0.9}
  >
    {/* Drug Name First */}
    <View style={styles.drugBadge}>
      <MaterialIcons name="science" size={18} color="#FFFFFF" />
      <Text style={styles.drugText}>{caseItem.Drug}</Text>
    </View>

    {/* User Info Section */}
    <View style={styles.contentWrapper}>
      <View style={styles.nameSection}>
        <MaterialIcons name="badge" size={20} color="#2C3E50" />
        <Text style={styles.name}>{caseItem.addict_name}</Text>
      </View>

      <View style={styles.detailGrid}>
        {/* Phone Row */}
        <View style={styles.detailItem}>
          <MaterialIcons name="smartphone" size={16} color="#4A5568" />
          <Text style={styles.detailText}>
            {'Number:'}
            {caseItem.phone || 'No Phone'}
          </Text>
        </View>

        {/* CNIC Row */}
        <View style={styles.detailItem}>
          <MaterialIcons name="fingerprint" size={16} color="#4A5568" />
          <Text style={styles.detailText}>
          {'CNIC:'}
            {formatCNIC(caseItem.CNIC)}
          </Text>
        </View>
      </View>

      {/* Additional Notes */}
      {caseItem.additional_note && (
        <View style={styles.notesContainer}>
          <MaterialIcons name="sticky-note-2" size={16} color="#718096" />
          <Text style={styles.notes}>{caseItem.additional_note}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const CasesList = ({ cases }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Case Registry</Text>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{cases.length} Records</Text>
        </View>
      </View>

      <FlatList
        data={cases}
        renderItem={({ item }) => <CaseListItem caseItem={item} />}
        keyExtractor={(item) => `${item.CNIC}-${Date.now()}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="folder-off" size={48} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>No Cases Found</Text>
            <Text style={styles.emptySubtitle}>Add new case to begin tracking</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A365D',
    letterSpacing: -0.5,
  },
  countPill: {
    backgroundColor: '#4299E1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 0,
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  drugBadge: {
    backgroundColor: '#48BB78',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  drugText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  contentWrapper: {
    padding: 16,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: '100%',
  },
  detailText: {
    color: '#4A5568',
    fontSize: 14,
    marginLeft: 8,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  notes: {
    color: '#718096',
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#718096',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#A0AEC0',
    fontSize: 14,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default CasesList;