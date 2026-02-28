import { Box } from "@/components/restyle";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LiquidGlassView } from "../LiquidGlassView";
import { FontAwesome } from "@expo/vector-icons";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TABS = [
  { name: "index", label: "Home", icon: "home" as const },
  { name: "create-model", label: "Criar", icon: "plus" as const },
  { name: "login", label: "Conta", icon: "user-circle" as const },
];

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const animations = useRef(
    TABS.map((_, i) => ({
      scale: new Animated.Value(i === state.index ? 1 : 0.85),
      opacity: new Animated.Value(i === state.index ? 1 : 0),
    })),
  ).current;

  useEffect(() => {
    animations.forEach((anim, i) => {
      const focused = i === state.index;
      Animated.parallel([
        Animated.spring(anim.scale, {
          toValue: focused ? 1 : 0.85,
          useNativeDriver: true,
          damping: 14,
          stiffness: 160,
        }),
        Animated.timing(anim.opacity, {
          toValue: focused ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [state.index]);

  return (
    <Box
      style={[styles.outerWrapper, { bottom: insets.bottom }]}
      pointerEvents="box-none"
    >
      <Box style={styles.pill}>
        <LiquidGlassView
          intensity={50}
          tint="dark"
          borderRadius={22}
          style={StyleSheet.absoluteFillObject}
        />

        <Box style={styles.tabsRow}>
          {TABS.map((tab, index) => {
            const focused = state.index === index;
            const isCreate = tab.name === "create-model";
            const route = state.routes[index];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route?.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented && route) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={tab.name}
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.tabItem, isCreate && styles.centerTabWrapper]}
              >
                {!isCreate && (
                  <Animated.View
                    style={[
                      styles.activeBubble,
                      {
                        opacity: animations[index].opacity,
                        transform: [{ scale: animations[index].scale }],
                      },
                    ]}
                  >
                    <LiquidGlassView
                      intensity={50}
                      tint="light"
                      borderRadius={22}
                      style={StyleSheet.absoluteFillObject}
                    />
                  </Animated.View>
                )}

                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: animations[index].scale.interpolate({
                          inputRange: [0.85, 1],
                          outputRange: isCreate ? [0.95, 1.05] : [0.9, 1.1],
                        }),
                      },
                    ],
                  }}
                >
                  {isCreate ? (
                    <View style={styles.createButton}>
                      <LiquidGlassView
                        intensity={50}
                        tint="dark"
                        style={[StyleSheet.absoluteFillObject]}
                      />
                      <FontAwesome name={tab.icon} size={26} color="#FFFFFF" />
                    </View>
                  ) : (
                    <FontAwesome
                      name={tab.icon}
                      size={24}
                      color={focused ? "#FFFFFF" : "rgba(255,255,255,0.45)"}
                    />
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
    padding: 4,
    elevation: 20,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    padding: 4,
    elevation: 20,
  },
  pillBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    borderWidth: 1,
    borderTopColor: "rgba(255,255,255,0.18)",
    borderLeftColor: "rgba(255,255,255,0.08)",
    borderRightColor: "rgba(255,255,255,0.08)",
    borderBottomColor: "rgba(255,255,255,0.02)",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 12,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 22,
    width: 50,
    height: 50,
    gap: 4,
  },
  centerTabWrapper: {
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  createButton: {
    width: 50,
    height: 50,
    borderRadius: 22,
    backgroundColor: "#0026ff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0026ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  activeBubble: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    overflow: "hidden",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
