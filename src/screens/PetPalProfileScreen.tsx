import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import { getUserById } from '../services/users';
import { getToken, removeToken } from '../storage/token';
import { jwtDecode } from 'jwt-decode';

const CHECKS = [
  { key: 'cuidador', label: 'Cuidador' },
  { key: 'paseador', label: 'Paseador' },
  { key: 'grande', label: 'Mascotas grandes' },
  { key: 'mediana', label: 'Mascotas medianas' },
  { key: 'chica', label: 'Mascotas chicas' },
  { key: 'perro', label: 'Perro' },
  { key: 'gato', label: 'Gato' },
];

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  // Agrega aquí otras pantallas si es necesario
};

type PetPalProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface PetPalProfileScreenProps {
  navigation: PetPalProfileScreenNavigationProp;
}

export default function PetPalProfileScreen({ navigation }: PetPalProfileScreenProps) {
  const [activo, setActivo] = useState(true);
  const [checks, setChecks] = useState<string[]>([
    'cuidador', 'paseador', 'grande', 'mediana', 'chica', 'perro', 'gato'
  ]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const toggleCheck = (key: string) => {
    setChecks(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await removeToken?.();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }
      ]
    );
  };


  const groupedChecks = [
    {
      title: 'Servicios',
      data: CHECKS.filter(c => c.key === 'cuidador' || c.key === 'paseador'),
    },
    {
      title: 'Tamaños de mascota',
      data: CHECKS.filter(c => ['grande', 'mediana', 'chica'].includes(c.key)),
    },
    {
      title: 'Tipo de mascota',
      data: CHECKS.filter(c => c.key === 'perro' || c.key === 'gato'),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={commonStyles.container}>
        <ScreenHeader title="Mi Perfil" subtitle="Información profesional" />
        <View style={styles.profileCard}>
          <View style={styles.profileHeader} />
          <View style={styles.avatarBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.substring(0, 2).toUpperCase() || 'PP'}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Nombre del PetPal'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'petpal@email.com'}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
 
          {/* Botón central de estado */}
          <TouchableOpacity
            style={[
              styles.statusBtn,
              { backgroundColor: activo ? colors.secondary : '#e74c3c' }
            ]}
            onPress={() => setActivo(a => !a)}
            activeOpacity={0.85}
          >
            <Icon
              name={activo ? 'check-circle' : 'close-circle'}
              size={24}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.statusBtnText}>
              {activo ? 'Activo' : 'No activo'}
            </Text>
          </TouchableOpacity>

          {/* Características agrupadas en recuadro */}
          <View style={styles.featuresBox}>
            {groupedChecks.map(group => (
              <View key={group.title} style={styles.checkGroup}>
                <Text style={styles.checkGroupTitle}>{group.title}</Text>
                <View style={styles.checkListContainer}>
                  {group.data.map(item => (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.checkItem,
                        checks.includes(item.key) && styles.checkItemActive
                      ]}
                      onPress={() => toggleCheck(item.key)}
                      activeOpacity={0.7}
                    >
                      <Icon
                        name={checks.includes(item.key) ? 'check-circle' : 'checkbox-blank-circle-outline'}
                        size={18}
                        color={checks.includes(item.key) ? colors.primary : '#bbb'}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[
                        styles.checkLabel,
                        checks.includes(item.key) && { color: colors.primary, fontWeight: 'bold' }
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Menú de usuario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajustes</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconBox}>
                <Icon name="account-cog" size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Configuración de cuenta</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconBox}>
                <Icon name="credit-card" size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Métodos de pago</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconBox}>
                <Icon name="heart" size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Favoritos</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconBox}>
                <Icon name="help-circle" size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Centro de ayuda</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconBox}>
                <Icon name="cog" size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Preferencias</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={18} color="#EB5757" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>PetPal v1.0.0 © 2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  profileHeader: {
    height: 36,
    backgroundColor: '#D1FADF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  avatarBox: { alignItems: 'center', marginTop: -20 },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#E8F6EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff'
  },
  avatarText: { color: '#219653', fontWeight: 'bold', fontSize: 22 },
  profileInfo: { alignItems: 'center', marginTop: 4, marginBottom: 8 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#22223B' },
  profileEmail: { color: '#888', marginBottom: 4, fontSize: 13 },
  editBtn: {
    backgroundColor: '#6FCF97',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  editBtnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginVertical: 14,
    alignSelf: 'center',
  },
  statusBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  featuresBox: {
    backgroundColor: '#F6FFF8',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    elevation: 1,
    borderWidth: 1.5,
    borderColor: colors.primary, // Borde destacado
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  checkGroup: {
    marginBottom: 8,
  },
  checkGroupTitle: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 17, // Más grande
    marginBottom: 4,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  checkListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 2,
    gap: 2,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FFF8',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 120, // <-- Fija el ancho mínimo para que no se muevan
  },
  checkItemActive: {
    borderColor: colors.primary,
    backgroundColor: '#eafaf1',
  },
  checkLabel: {
    color: '#555',
    fontSize: 14,
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#22223B', marginBottom: 8 },
  menuCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuIconBox: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#E8F6EF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { fontSize: 15, color: '#22223B' },
  separator: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EB5757', borderRadius: 20, paddingVertical: 10, marginBottom: 18, marginTop: 10 },
  logoutBtnText: { color: '#EB5757', fontWeight: 'bold', fontSize: 16 },
  versionText: { color: '#888', fontSize: 12, textAlign: 'center', marginBottom: 18 },
});

const commonStyles = StyleSheet.create({
  container: {
    padding: 18,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});