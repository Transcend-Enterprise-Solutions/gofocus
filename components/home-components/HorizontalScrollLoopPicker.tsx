import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,TouchableWithoutFeedback, Keyboard } from 'react-native';

const ITEM_WIDTH = 50;
const ITEM_SPACING = 1;

interface PomodoroPickerProps {
  onSelect: (count: number) => void;
  initialCount?: number;
}

export default function HorizontalScrollLoopPicker({ onSelect, initialCount = 1 }: PomodoroPickerProps) {
  const [selectedCount, setSelectedCount] = useState(initialCount);
  const scrollViewRef = useRef<ScrollView>(null);
  const counts = Array.from({ length: 60 }, (_, i) => i + 1);

  const handleSelect = (count: number) => {
    setSelectedCount(count);
    onSelect(count);
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => Keyboard.isVisible()}>
          <View>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                  paddingRight: Dimensions.get('window').width - ITEM_WIDTH - ITEM_SPACING * 2,
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 100,
                  paddingBottom: 10,
                  paddingTop: 10,
                  paddingLeft: 10,
              }}
            >
              {counts.map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => handleSelect(count)}
                  style={{ width: ITEM_WIDTH, marginHorizontal: ITEM_SPACING }}
                >
                  <View className="rounded-full py-2 px-4 justify-left items-center" style={[ selectedCount === count && styles.selectedText ]}>
                    <Text className={`text-2xl font-medium ${selectedCount === count ? 'text-slate-800' : 'text-gray-300'}`}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedText: {
    backgroundColor: 'white',
  },
});