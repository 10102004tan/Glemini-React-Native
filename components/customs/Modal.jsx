import { Text, View } from "react-native"
import Overlay from "./OverlayV2"

const Modal = ({
  children,
  modalTitle = "Modal Title",
  height = "40%",
  onClose = () => { },
}) => {
  return (
    <Overlay>
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          margin: 20,
          flex: 1,
          maxHeight: height,
          minHeight: 200,
        }}
      >
        {/* title */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          {modalTitle}
        </Text>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            padding: 10,
            borderRadius: 5,
          }}
        >
          {children}
        </View>
      </View>
    </Overlay>
  )
}

export default Modal
