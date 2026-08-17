import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Repeat, Sparkles, Star } from 'lucide-react-native';

export default function MobileMatchesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6 }}>Your Skill Matches</Text>
        <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>Perfect reciprocal swaps paired with high compatibility.</Text>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', items: 'center', gap: 10 }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' }} style={{ width: 44, height: 44, borderRadius: 16 }} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>Sarah Jenkins</Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Senior UI/UX Designer</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }}>98% Match</Text>
            </View>
          </View>

          <Text style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>
            ✓ You offer C++ • Sarah teaches Photoshop & UI/UX Design!
          </Text>

          <TouchableOpacity style={{ backgroundColor: '#6366F1', paddingVertical: 10, borderRadius: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>Request Skill Swap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
