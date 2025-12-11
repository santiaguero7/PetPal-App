import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

const { width } = Dimensions.get('window');

export default function ScreenHeader({ title, subtitle, icon = 'paw' }: ScreenHeaderProps) {
  // --- Refs para Animaciones de Entrada (Entrance) ---
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const subY = useRef(new Animated.Value(20)).current;

  // --- Refs para Animaciones Constantes (Loop) ---
  const loopAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    // 1. ANIMACIÓN DE ENTRADA (Stagger)
    const entranceTitle = Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false, 
        easing: Easing.out(Easing.back(1.5)), 
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
    ]);

    const entranceSub = Animated.parallel([
      Animated.timing(subOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(subY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
    ]);

    Animated.stagger(100, [entranceTitle, entranceSub]).start();

    // 2. ANIMACIÓN CONSTANTE (Loop Infinito)
    Animated.loop(
      Animated.sequence([
        Animated.timing(loopAnim, {
          toValue: 1,
          duration: 3000, 
          // AQUÍ ESTABA EL ERROR: Cambiamos 'sine' por 'sin'
          easing: Easing.inOut(Easing.sin), 
          useNativeDriver: false, 
        }),
        Animated.timing(loopAnim, {
          toValue: 0,
          duration: 3000, 
          // AQUÍ TAMBIÉN: 'sine' por 'sin'
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // --- INTERPOLACIONES ---

  const lineWidth = loopAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 100], 
  });

  const lineColor = loopAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [colors.primary, '#219653', '#A5D6A7'], 
  });

  const iconTranslateY = loopAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8], 
  });

  const iconRotate = loopAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        
        {/* COLUMNA DE TEXTO */}
        <View style={{ flex: 1 }}>
          <Animated.Text 
            style={[
              styles.title, 
              { opacity: titleOpacity, transform: [{ translateY: titleY }] }
            ]}
          >
            {title}
          </Animated.Text>

          {subtitle && (
            <Animated.Text 
              style={[
                styles.subtitle, 
                { opacity: subOpacity, transform: [{ translateY: subY }] }
              ]}
            >
              {subtitle}
            </Animated.Text>
          )}

          {/* LÍNEA DECORATIVA VIVA */}
          <Animated.View 
            style={[
              styles.decoration, 
              { 
                width: lineWidth, 
                backgroundColor: lineColor 
              }
            ]} 
          />
        </View>

        {/* COLUMNA DE ICONO FLOTANTE */}
        <Animated.View 
          style={{
            opacity: subOpacity,
            transform: [
              { translateY: iconTranslateY },
              { rotate: iconRotate }
            ]
          }}
        >
          <Icon name={icon} size={48} color={colors.primary} style={styles.floatingIcon} />
          <View style={styles.iconShadow} />
        </Animated.View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22223B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginTop: 4,
    maxWidth: '90%',
  },
  decoration: {
    height: 6, 
    marginTop: 12,
    borderRadius: 3,
  },
  floatingIcon: {
    opacity: 0.8, 
  },
  iconShadow: {
    width: 30,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 2,
    transform: [{ scaleX: 1.5 }]
  }
});