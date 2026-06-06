import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export default function PlayerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { m3u8, name, logo, category } = useLocalSearchParams<{
    m3u8: string;
    name: string;
    logo: string;
    category: string;
  }>();

  const player = useVideoPlayer(m3u8 ?? "", (p) => {
    p.play();
    p.loop = true;
  });

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    videoWrapper: {
      flex: 1,
      backgroundColor: "#000",
    },
    video: {
      flex: 1,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 8),
      paddingHorizontal: 16,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    channelInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logoSmall: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    channelTextWrapper: {
      flex: 1,
    },
    channelName: {
      color: "#fff",
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      textShadowColor: "rgba(0,0,0,0.8)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    categoryText: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 11,
      fontFamily: "Inter_400Regular",
    },
    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
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
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    streamingText: {
      color: "rgba(255,255,255,0.5)",
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    noStream: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    noStreamText: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 14,
      fontFamily: "Inter_400Regular",
    },
  });

  if (!m3u8) {
    return (
      <View style={[styles.container, styles.noStream]}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Feather name="alert-circle" size={40} color="rgba(255,255,255,0.5)" />
        <Text style={styles.noStreamText}>স্ট্রিম পাওয়া যায়নি</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
        nativeControls
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={goBack} activeOpacity={0.8}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.channelInfo}>
          {logo ? (
            <Image
              source={{ uri: logo }}
              style={styles.logoSmall}
              resizeMode="contain"
            />
          ) : null}
          <View style={styles.channelTextWrapper}>
            <Text style={styles.channelName} numberOfLines={1}>
              {name ?? "Channel"}
            </Text>
            {category ? (
              <Text style={styles.categoryText}>{category}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.streamingText}>লাইভ স্ট্রিমিং চলছে</Text>
      </View>
    </View>
  );
}
