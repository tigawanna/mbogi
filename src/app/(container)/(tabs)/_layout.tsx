import { HapticTab } from '@/components/default/HapticTab';
import { IconSymbol, MaterialIcon } from '@/components/default/ui/IconSymbol.ios';
import TabBarBackground from '@/components/default/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // transitionSpec: { animation: "timing", config: { delay: 0, duration: 3, easing: Easing.bounce } },
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        lazy: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Watchlist",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          headerShown: false,
          title: "Discover",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          headerShown: false,
          title: "Community",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="people" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="verified-user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
