import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const DUMMY_USERS = [
  { id: '1', name: 'Alice Johnson', online: true },
  { id: '2', name: 'Bob Smith', online: true },
  { id: '3', name: 'Charlie Brown', online: true },
  { id: '4', name: 'Diana Prince', online: true },
  { id: '5', name: 'Ethan Hunt', online: true },
  { id: '6', name: 'Fiona Glenanne', online: true },
  { id: '7', name: 'Gabe Logan', online: true },
  { id: '8', name: 'Hannah Lee', online: true },
];

const CURRENT_USER = { id: 'me', name: 'Okasha Arshad' };

type User = { id: string; name: string };

type Seat = { occupiedBy?: User | null };

type Room = { id: string; name: string; seats: Seat[] };

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  const initials = parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');
  return initials || 'U';
}

export default function TabTwoScreen() {
  const [rooms, setRooms] = useState<Room[]>(() => {
    return [
      { id: 'r1', name: 'Room 1', seats: Array.from({ length: 4 }, () => ({ occupiedBy: null })) },
      { id: 'r2', name: 'Room 2', seats: Array.from({ length: 4 }, () => ({ occupiedBy: null })) },
      { id: 'r3', name: 'Room 3', seats: Array.from({ length: 4 }, () => ({ occupiedBy: null })) },
    ];
  });

  const avatarListData = useMemo(() => [CURRENT_USER, ...DUMMY_USERS], []);
  const [selectedUser, setSelectedUser] = useState<User>(avatarListData[0]);

  const handleSeatPress = (roomIndex: number, seatIndex: number) => {
    if (!selectedUser) return;

    setRooms(prev => {
      let currentRoomIndex = -1;
      let currentSeatIndex = -1;
      for (let r = 0; r < prev.length; r++) {
        for (let s = 0; s < prev[r].seats.length; s++) {
          if (prev[r].seats[s].occupiedBy?.id === selectedUser.id) {
            currentRoomIndex = r;
            currentSeatIndex = s;
            break;
          }
        }
        if (currentRoomIndex !== -1) break;
      }

      const targetSeatPrev = prev[roomIndex].seats[seatIndex];
      if (targetSeatPrev.occupiedBy && targetSeatPrev.occupiedBy.id !== selectedUser.id) {
        return prev;
      }

      if (currentRoomIndex === roomIndex && currentSeatIndex === seatIndex) {
        return prev;
      }

      const next = prev.map(r => ({ ...r, seats: r.seats.map(s => ({ ...s })) }));

      if (currentRoomIndex !== -1 && currentSeatIndex !== -1) {
        next[currentRoomIndex].seats[currentSeatIndex].occupiedBy = null;
      }

      next[roomIndex].seats[seatIndex].occupiedBy = { ...selectedUser };

      return next;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Online Users</ThemedText>
          </View>
          <FlatList
            data={avatarListData}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedUser?.id;
              return (
                <Pressable onPress={() => setSelectedUser(item)}>
                  <View style={styles.card}>
                    <View style={styles.avatarWrapper}>
                      <View style={[styles.avatar, isSelected ? styles.avatarSelected : null]}>
                        <ThemedText type="defaultSemiBold">{getInitials(item.name)}</ThemedText>
                      </View>
                      {('online' in item ? (item as any).online : true) ? <View style={styles.onlineDot} /> : null}
                    </View>
                    <ThemedText style={styles.name} numberOfLines={1}>
                      {item.name}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            }}
          />

          <View style={styles.roomsSection}>
            {rooms.map((room, rIdx) => (
              <View key={room.id} style={styles.roomContainer}>
                <ThemedText type="defaultSemiBold" style={styles.roomTitle}>{room.name}</ThemedText>
                <View style={styles.seatsGrid}>
                  {room.seats.map((seat, sIdx) => {
                    const isOccupied = !!seat.occupiedBy;
                    return (
                      <Pressable
                        key={`${room.id}-seat-${sIdx}`}
                        onPress={() => handleSeatPress(rIdx, sIdx)}
                        style={({ pressed }) => [
                          styles.seat,
                          isOccupied ? styles.seatOccupied : styles.seatEmpty,
                          pressed ? styles.seatPressed : null,
                          selectedUser && seat.occupiedBy?.id === selectedUser.id ? styles.seatSelected : null,
                        ]}
                      >
                        {isOccupied ? (
                          <View style={styles.seatContent}>
                            <View style={styles.seatAvatar}>
                              <ThemedText type="defaultSemiBold">
                                {getInitials(seat.occupiedBy?.name || '')}
                              </ThemedText>
                            </View>
                          </View>
                        ) : (
                          <ThemedText style={styles.plus}>+</ThemedText>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 72;
const DOT_SIZE = 14;
const ROOM_HEIGHT = 120;
const SEAT_AVATAR = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    alignItems: 'center',
    marginRight: 16,
    width: AVATAR_SIZE + 20,
  },
  avatarWrapper: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatarSelected: {
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  onlineDot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#22c55e',
    top: AVATAR_SIZE * 0.15 - DOT_SIZE / 2,
    left: AVATAR_SIZE * 0.15 - DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1,
  },
  name: {
    marginTop: 8,
    maxWidth: AVATAR_SIZE + 20,
  },
  roomsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
  },
  roomContainer: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  roomTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  seat: {
    width: '48%',
    height: ROOM_HEIGHT / 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  seatEmpty: {
    backgroundColor: '#fafafa',
    borderColor: '#e5e7eb',
  },
  seatOccupied: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  seatSelected: {
    borderColor: '#0d9488',
    borderWidth: 2,
  },
  seatPressed: {
    opacity: 0.9,
  },
  plus: {
    fontSize: 28,
    color: '#9ca3af',
  },
  seatContent: {
    alignItems: 'center',
  },
  seatAvatar: {
    width: SEAT_AVATAR,
    height: SEAT_AVATAR,
    borderRadius: SEAT_AVATAR / 2,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  seatUserName: {
    maxWidth: '90%',
  },
});