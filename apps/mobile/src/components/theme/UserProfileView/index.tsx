import { Box } from "@/src/components/restyle";
import React from "react";
import { Text, StyleSheet } from "react-native";
import { LiquidGlassView } from "../LiquidGlassView";
import { Model3DList } from "../Model3DList";

export type User = {
  name: string;
  email?: string;
};

export type UserProfileViewProps = {
  user: User;
};

const MOCK_STATS = {
  followers: 2847,
  likes: 14320,
  models: 38,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export function UserProfileView({ user }: UserProfileViewProps) {
  const initials = getInitials(user.name);

  return (
    <>
      <Box style={styles.container}>
        <LiquidGlassView style={StyleSheet.absoluteFill} intensity={15} />
        <Box style={styles.avatarRing}>
          <Box style={styles.avatar}>
            <LiquidGlassView
              style={StyleSheet.absoluteFill}
              intensity={15}
              borderRadius={100}
            />
            <Text style={styles.initials}>{initials}</Text>
          </Box>
        </Box>

        <Text style={styles.name}>{user.name}</Text>
        {user.email && <Text style={styles.email}>{user.email}</Text>}

        <Box style={styles.divider} />

        <Box style={styles.statsRow}>
          <StatItem
            label="Seguidores"
            value={formatNumber(MOCK_STATS.followers)}
          />
          <Box style={styles.statSeparator} />
          <StatItem label="Likes" value={formatNumber(MOCK_STATS.likes)} />
          <Box style={styles.statSeparator} />
          <StatItem label="Modelos" value={String(MOCK_STATS.models)} />
        </Box>
      </Box>
      <Text style={styles.sectionTitle}>Meus modelos</Text>
      <Model3DList listType="MY" marginTop="none" />
    </>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <Box style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Box>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 40,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.3,
    marginLeft: 16,
    textAlign: "left",
    width: "100%",
  },
  container: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 28,
    paddingBottom: 28,
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  avatarRing: {
    marginTop: 48,
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.3,
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#bbbbbb",
    letterSpacing: 0.2,
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#F0EEFF",
    marginTop: 20,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    width: "100%",
    justifyContent: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 12,
    color: "#d2d2d2",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  statSeparator: {
    width: 1,
    height: 32,
    backgroundColor: "#ECECEC",
  },
});
