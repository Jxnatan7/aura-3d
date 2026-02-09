import { useEffect } from "react";
import EventSource, { EventSourceListener } from "react-native-sse";
import { useModelStore } from "@/stores/modelStore";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`;

export function useModelSSE(modelId: string | null) {
  const { updateModelStatus, isCompleted } = useModelStore();

  useEffect(() => {
    if (!modelId || isCompleted) return;

    console.log(`[SSE] Conectando ao stream do modelo: ${modelId}`);
    const es = new EventSource(`${API_URL}/sse/model/${modelId}`, {
      headers: {},
    });

    const listener: EventSourceListener = (event) => {
      if (event.type === "open") {
        console.log("[SSE] Conexão aberta");
      } else if (event.type === "message") {
        try {
          const parsedData = JSON.parse(event.data || "");
          console.log("[SSE] Atualização recebida:", parsedData);

          updateModelStatus(parsedData);
        } catch (err) {
          console.error("[SSE] Erro ao parsear dados:", err);
        }
      } else if (event.type === "error") {
        console.error("[SSE] Erro na conexão:", event.message);
      }
    };

    es.addEventListener("open", listener);
    es.addEventListener("message", listener);
    es.addEventListener("error", listener);

    return () => {
      console.log("[SSE] Fechando conexão");
      es.removeAllEventListeners();
      es.close();
    };
  }, [modelId, isCompleted, updateModelStatus]);
}
