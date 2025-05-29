import { View } from "react-native"
import React from "react";

const Overlay = ({
  children
}:{
    children: React.ReactNode
}) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  )
}

export default Overlay;