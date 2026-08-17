import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Clock, BookOpen, ShieldCheck, Repeat } from 'lucide-react-native';
import FloatingActionButton from '../../components/FloatingActionButton';

export default function MobileHomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#6366F1', textTransform: 'uppercase', letterSpacing: 0.5 }}>EXCHANGE SKILLS, NOT MONEY</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A', marginTop: 2 }}>Welcome, Vineet 👋</Text>
          </View>

          {/* Time Credits Counter Pill */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FDE68A' }}>
            <Zap size={14} color="#D97706" />
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#B45309', marginLeft: 4 }}>12.5 CR</Text>
          </View>
        </View>

        {/* Stats Card Row */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Taught</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#6366F1', marginTop: 4 }}>12 hrs</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Learned</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#8B5CF6', marginTop: 4 }}>6 hrs</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Trust Score</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#10B981', marginTop: 4 }}>94/100</Text>
          </View>
        </View>

        {/* Featured Reciprocal Match */}
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 }}>Top Reciprocal Match 🔥</Text>
        
        <View style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' }} style={{ width: 44, height: 44, borderRadius: 16 }} />
              <View>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A' }}>Sarah Jenkins</Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Senior UI/UX Designer • 2.1 km</Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }}>98% Match</Text>
            </View>
          </View>

          <View style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
            <View>
              <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>OFFERS</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#6366F1' }}>UI/UX Design & Photoshop</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 9, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>WANTS</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#8B5CF6' }}>C++ Algorithms</Text>
            </View>
          </View>

          <TouchableOpacity style={{ backgroundColor: '#6366F1', paddingVertical: 12, borderRadius: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#FFFFFF' }}>Request Direct Skill Swap</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </SafeAreaView>
  );
}
