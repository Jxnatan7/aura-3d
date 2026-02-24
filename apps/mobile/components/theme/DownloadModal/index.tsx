import React from "react";
import { StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Box, Text } from "@/components/restyle";

export const DownloadModal = ({
  name,
  visible,
  onClose,
  formats,
  onDownload,
}: any) => {
  const availableFormats = Object.entries(formats).filter(([_, url]) => !!url);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Box style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text
            variant="infoTitle"
            style={{ color: "black", marginBottom: 15 }}
          >
            Escolha o formato
          </Text>
          {availableFormats.map(([ext, url]) => (
            <TouchableOpacity
              key={ext}
              style={styles.formatButton}
              onPress={() => onDownload(url, name, ext)}
            >
              <Text style={styles.formatButtonText}>
                {String(name).toUpperCase()}.{ext.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.formatButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={[styles.formatButtonText, { color: "red" }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    alignItems: "center",
  },
  formatButton: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  cancelButton: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  formatButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
