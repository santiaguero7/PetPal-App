import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../themes/commonStyles';

export default function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ minHeight: 68, justifyContent: 'flex-end', marginBottom: 18, marginTop: 8 }}>
      <Text style={commonStyles.screenTitle}>{title}</Text>
      {subtitle ? <Text style={commonStyles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}