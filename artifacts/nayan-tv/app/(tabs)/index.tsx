import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface Channel {
  id: string;
  name: string;
  category: string;
  logo: string;
  m3u8: string;
}

interface ApiResponse {
  total: number;
  categories: Record<string, Channel[]>;
}

const API_URL = "https://live-stream-api--systemfuck.replit.app/api/channels";

const CATEGORY_ICONS: Record<string, string> = {
  All: "tv",
  Sports: "activity",
  Bangla: "globe",
  Hindi: "film",
  Kids: "star",
  Other: "grid",
};

function fetchChannels(): Promise<ApiResponse> {
  return fetch(API_URL).then((res) => res.json());
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ["channels"],
    queryFn: fetchChannels,
    staleTime: 5 * 60 * 1000,
  });

  const categories = data ? ["All", ...Object.keys(data.categories)] : ["All"];

  const channels: Channel[] = data
    ? selectedCategory === "All"
      ? Object.values(data.categories).flat()
      : data.categories[selectedCategory] ?? []
    : [];

  const openPlayer = useCallback(
    (channel: Channel) => {
      router.push({
        pathname: "/player",
        params: {
          m3u8: channel.m3u8,
          name: channel.name,
          logo: channel.logo,
          category: channel.category,
        },
      });
    },
    []
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingBottom: 12,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    liveIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#fff",
    },
    liveText: {
      color: "#fff",
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      letterSpacing: 1,
    },
    appName: {
      color: colors.foreground,
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      letterSpacing: 0.5,
    },
    appNameAccent: {
      color: colors.primary,
    },
    totalText: {
      color: colors.mutedForeground,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    categoryContainer: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginHorizontal: 4,
      backgroundColor: colors.secondary,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
    },
    categoryText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    categoryTextActive: {
      color: "#fff",
    },
    list: {
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
    },
    row: {
      justifyContent: "space-between",
      marginBottom: 2,
    },
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      margin: 5,
      padding: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoContainer: {
      width: 64,
      height: 64,
      borderRadius: 12,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      overflow: "hidden",
    },
    logo: {
      width: 56,
      height: 56,
      borderRadius: 8,
    },
    logoFallback: {
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
    },
    channelName: {
      color: colors.foreground,
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      textAlign: "center",
      numberOfLines: 2,
    },
    categoryBadge: {
      marginTop: 5,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: colors.muted,
    },
    categoryBadgeText: {
      color: colors.mutedForeground,
      fontSize: 9,
      fontFamily: "Inter_500Medium",
      letterSpacing: 0.5,
    },
    liveRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    liveDotSmall: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.primary,
    },
    liveSmallText: {
      color: colors.primary,
      fontSize: 9,
      fontFamily: "Inter_600SemiBold",
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    errorText: {
      color: colors.mutedForeground,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryText: {
      color: "#fff",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    emptyText: {
      color: colors.mutedForeground,
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.errorText}>চ্যানেল লোড হচ্ছে...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
        <Text style={styles.errorText}>চ্যানেল লোড করা যায়নি</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>আবার চেষ্টা করুন</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.appName}>
            <Text style={styles.appNameAccent}>NAYAN</Text> TV
          </Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.totalText}>{data?.total ?? 0}টি চ্যানেল উপলব্ধ</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => {
          const isActive = cat === selectedCategory;
          const icon = CATEGORY_ICONS[cat] ?? "grid";
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Feather
                name={icon as any}
                size={13}
                color={isActive ? "#fff" : colors.mutedForeground}
              />
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={channels}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        scrollEnabled={!!channels.length}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openPlayer(item)}
            activeOpacity={0.75}
          >
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: item.logo }}
                style={styles.logo}
                resizeMode="contain"
                onError={() => {}}
              />
            </View>
            <Text style={styles.channelName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.liveRow}>
              <View style={styles.liveDotSmall} />
              <Text style={styles.liveSmallText}>LIVE</Text>
            </View>
            {selectedCategory === "All" && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>কোনো চ্যানেল নেই</Text>
          </View>
        }
      />
    </View>
  );
}
