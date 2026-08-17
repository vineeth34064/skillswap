import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare } from 'lucide-react-native';

export default function MobileMessagesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 }}>Messages</Text>

        <TouchableOpacity style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' }} style={{ width: 44, height: 44, borderRadius: 22 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justify: 'space-between', marginBottom: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>Sarah Jenkins</Text>
              <Text style={{ fontSize: 10, color: '#94A3B8' }}>10:42 AM</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#64748B' }} numberOfLines={1}>Looking forward to our Figma session tomorrow!</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
