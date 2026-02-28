import React, { useEffect } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LiquidGlassView } from "../LiquidGlassView";
import { Box, Text } from "@/components/restyle";

type GlassAlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
};

export function GlassAlertModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Entrar",
}: GlassAlertModalProps) {
  useEffect(() => {
    if (Platform.OS === "ios" && visible) {
      Alert.alert(title, message, [
        {
          text: cancelText,
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: "default",
          onPress: onConfirm,
        },
      ]);
    }
  }, [visible]);

  if (Platform.OS === "ios") return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box style={styles.alertContainer}>
            <LiquidGlassView
              intensity={60}
              tint="dark"
              borderRadius={14}
              style={styles.glassWrapper}
            >
              <Box style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </Box>

              <Box style={styles.horizontalSeparator} />

              <Box style={styles.buttonsRow}>
                <TouchableOpacity style={styles.button} onPress={onCancel}>
                  <Text style={styles.cancelButtonText} color="gray100">
                    {cancelText}
                  </Text>
                </TouchableOpacity>
                <Box style={styles.verticalSeparator} />

                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                  <Text style={styles.confirmButtonText} color="gray100">
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </Box>
            </LiquidGlassView>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: 270,
  },
  glassWrapper: {
    width: "100%",
    overflow: "hidden",
  },
  textContainer: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 18,
  },
  horizontalSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  verticalSeparator: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonsRow: {
    flexDirection: "row",
    height: 44,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: "400",
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});
