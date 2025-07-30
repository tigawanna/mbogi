import { ViewMode } from '@/store/view-preferences-store';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, SegmentedButtons, useTheme } from 'react-native-paper';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  variant?: 'segmented' | 'buttons';
}

export function ViewToggle({ 
  viewMode, 
  onViewModeChange, 
  variant = 'buttons' 
}: ViewToggleProps) {
  const theme = useTheme();

  if (variant === 'segmented') {
    return (
      <SegmentedButtons
        value={viewMode}
        onValueChange={(value) => onViewModeChange(value as ViewMode)}
        buttons={[
          {
            value: 'grid',
            icon: 'view-grid',
            label: 'Grid',
            style: { backgroundColor: viewMode === 'grid' ? theme.colors.primaryContainer : theme.colors.surface }
          },
          {
            value: 'list',
            icon: 'view-list',
            label: 'List',
            style: { backgroundColor: viewMode === 'list' ? theme.colors.primaryContainer : theme.colors.surface }
          },
        ]}
        style={styles.segmentedButtons}
      />
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <IconButton
        icon="view-grid"
        mode={viewMode === 'grid' ? 'contained' : 'outlined'}
        onPress={() => onViewModeChange('grid')}
        size={20}
        iconColor={viewMode === 'grid' ? theme.colors.onPrimary : theme.colors.primary}
        containerColor={viewMode === 'grid' ? theme.colors.primary : 'transparent'}
      />
      <IconButton
        icon="view-list"
        mode={viewMode === 'list' ? 'contained' : 'outlined'}
        onPress={() => onViewModeChange('list')}
        size={20}
        iconColor={viewMode === 'list' ? theme.colors.onPrimary : theme.colors.primary}
        containerColor={viewMode === 'list' ? theme.colors.primary : 'transparent'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
});
