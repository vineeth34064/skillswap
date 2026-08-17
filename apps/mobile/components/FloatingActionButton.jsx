import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, BookOpen, Repeat, Calendar } from 'lucide-react-native';

const FloatingActionButton = ({ onOfferSkill, onRequestSwap, onCreateSession }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ position: 'absolute', bottom: 24, right: 24, alignItems: 'flex-end', zIndex: 50 }}>
      {open && (
        <View style={{ marginBottom: 12, gap: 10, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => { setOpen(false); if (onOfferSkill) onOfferSkill(); }}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, elevation: 4 }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginRight: 8 }}>Offer a Skill</Text>
            <BookOpen size={18} color="#6366F1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setOpen(false); if (onRequestSwap) onRequestSwap(); }}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, elevation: 4 }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginRight: 8 }}>Request a Swap</Text>
            <Repeat size={18} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setOpen(false); if (onCreateSession) onCreateSession(); }}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, elevation: 4 }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginRight: 8 }}>Create Session</Text>
            <Calendar size={18} color="#10B981" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#6366F1',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#6366F1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 6
        }}
      >
        <Plus size={28} color="#FFFFFF" style={{ transform: [{ rotate: open ? '45deg' : '0deg' }] }} />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionButton;
