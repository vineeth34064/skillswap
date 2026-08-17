import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Compass, Star, MapPin } from 'lucide-react-native';

export default function MobileDiscoverScreen() {
  const [search, setSearch] = useState('');

  const mentors = [
    { name: 'Sarah Jenkins', role: 'UI/UX Designer', teaches: 'Photoshop', dist: '2.1 km', rating: 5.0, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
    { name: 'Alex Rivera', role: 'Data Scientist', teaches: 'Python & ML', dist: '3.4 km', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
    { name: 'Elena Rostova', role: 'Linguist', teaches: 'Spanish', dist: '4.2 km', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 12 }}>Discover Mentors</Text>

        {/* Search Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 14, height: 48, marginBottom: 16 }}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search C++, React, Photoshop, Spanish..."
            placeholderTextColor="#94A3B8"
            style={{ flex: 1, marginLeft: 10, fontSize: 13, color: '#0F172A' }}
          />
        </View>

        {/* Mentors Cards */}
        {mentors.map((m, i) => (
          <View key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', items: 'center', gap: 12 }}>
              <Image source={{ uri: m.avatar }} style={{ width: 44, height: 44, borderRadius: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>{m.name}</Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>{m.role} • {m.dist}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#6366F1', marginTop: 4 }}>Teaches: {m.teaches}</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#6366F1' }}>Swap</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
