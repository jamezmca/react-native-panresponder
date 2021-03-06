import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, PanResponder, Animated } from 'react-native';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const colorMap = {}

export default function App() {
  const [array, setArray] = useState({
    data: Array.from(Array(200), (_, i) => {
      colorMap[i] = getRandomColor()
      return i
    })
  })

  const [draggingIdx, setDraggingIdx] = useState(-1)
  let dragging = false
  let scrollOffset = 0
  let flatListTopOffset = 0
  let rowHeight = 0
  let currentIdx = -1

  const point = useRef(new Animated.ValueXY()).current;


  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (evt, gestureState) => {
        //console.log(gestureState.y0)
        currentIdx = yToIndex(gestureState.y0)
        console.log(currentIdx)
        dragging = true
        setDraggingIdx(currentIdx)
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([{ y: point.y }], { useNativeDriver: false })({ y: gestureState.moveY })
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gestFure distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        false,
      onPanResponderRelease: (evt, gestureState) => {
        reset()
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        reset()
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    })
  ).current;

  function yToIndex(y) {
    return Math.floor((scrollOffset + y - flatListTopOffset) / rowHeight)
  }

  function reset() {
    dragging = false
  }

  const renderItem = ({ item }) => (
    <View
      onLayout={e => {
        rowHeight = e.nativeEvent.layout.height
      }}
      style={{
        padding: 16,
        backgroundColor: colorMap[item],
        flexDirection: 'row'
      }}>
      <View {...panResponder.panHandlers}>
        <Text style={{ fontSize: 28 }}>@</Text>
      </View>
      <Text style={{ fontSize: 22, textAlign: 'center', flex: 1 }}>{item}</Text>
    </View>)

  return (
    <View style={styles.container}>
      <Animated.View style={{
        position: 'absolute',
        backgroundColor: 'black',
        zIndex: 2,
        width: '100%',
        top: point.getLayout().top
      }}>
        {renderItem({ item: draggingIdx })}
      </Animated.View>
      <FlatList data={array.data}
        scrollEnabled={!dragging}
        style={{ width: '100%' }}
        renderItem={renderItem}
        onScroll={e => {
          scrollOffset = e.nativeEvent.contentOffset.y
        }}
        onLayout={e => {
          flatListTopOffset = e.nativeEvent.layout.y
        }}
        scrollEventThrottle={16}
        keyExtractor={(item) => "" + item} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
