import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, ShieldCheck, MapPin, Star, Award } from 'lucide-react-native';

export default function MobileProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', marginBottom: 16 }}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Vineet Kumar</Text>
          <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>@vineet • New York</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>
            <Zap size={14} color="#D97706" />
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#B45309', marginLeft: 4 }}>12.5 Time Credits</Text>
          </View>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 10 }}>Skills Offered (Teaches)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <View style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#6366F1' }}>C++ (Advanced)</Text>
            </View>
            <View style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#6366F1' }}>React (Advanced)</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 10 }}>Skills Wanted (Wants to Learn)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <View style={{ backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#8B5CF6' }}>UI/UX Design</Text>
            </View>
            <View style={{ backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#8B5CF6' }}>Video Editing</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
