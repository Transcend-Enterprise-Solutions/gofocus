import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

const ITEM_HEIGHT = 65;
interface CircularPickerProps {
  selectedOption: number;
  onSelect: (option: number) => void;
}

export default function CircularPicker({ selectedOption, onSelect }: CircularPickerProps) {
  const options = Array.from({ length: 1000 }, (_, i) => i + 1);
  const [selectedIndex, setSelectedIndex] = useState(options.indexOf(selectedOption));
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
  };

  const handleItemPress = (index: any) => {
    setSelectedIndex(index);
    onSelect(options[index]);
  };

  const formatTime = (time: number) => {
    return `${String(time).padStart(2, '0')}:00`;
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={options}
        keyExtractor={(item, index) => `${item}-${index}`}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="center"
        snapToInterval={ITEM_HEIGHT}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleItemPress(index)}>
            <Animated.View style={[styles.item, index === selectedIndex && styles.selectedItemText]}>
              <Text className='text-slate-600 font-light' style={[ styles.text , index === selectedIndex && styles.selectedText]}>
                {formatTime(item)}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        )}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={selectedIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: ITEM_HEIGHT * 0.85,
  },
  item: {
    height: ITEM_HEIGHT,
    backfaceVisibility: 'hidden',
    opacity: 0.5,
  },
  text: {
    fontSize: 35,
  },
  selectedText: {
    fontWeight: 'bold',
  },
  selectedItemText: {
    opacity: 1,
  },
});