import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import PetPalPostForm from '../components/PetPalPostForm';
import PetPalPostCard from '../components/PetPalPostCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPetpal } from '../services/petpals';

type PetPalFormValues = {
  service_type: 'dog walker' | 'caregiver';
  price_per_hour: string | number | null;
  price_per_day: string | number | null;
  experience: string;
  location: string;
  pet_type: 'dog' | 'cat';
  size_accepted: 'small' | 'medium' | 'large' | 'all';
};

export default function AddPubScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AddPub'>) {
  const [formValues, setFormValues] = useState<PetPalFormValues>({
    service_type: 'dog walker',
    price_per_hour: '',
    price_per_day: '',
    experience: '',
    location: '',
    pet_type: 'dog',
    size_accepted: 'medium',
  });

  type PetPalPost = PetPalFormValues & { id: string | number };

  const [posts, setPosts] = useState<PetPalPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<PetPalPost | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<PetPalFormValues | null>(null);

  const handleSubmit = async (values: PetPalFormValues) => {
    const {
      service_type,
      price_per_hour,
      price_per_day,
      experience,
      location,
      pet_type,
      size_accepted,
    } = values;

    if (!service_type || !experience || !location || !pet_type || !size_accepted) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const data = {
        service_type,
        price_per_hour: price_per_hour !== '' && !isNaN(Number(price_per_hour)) ? Number(Number(price_per_hour).toFixed(2)) : null,
        price_per_day: price_per_day && !isNaN(Number(price_per_day)) ? Number(price_per_day) : null,
        experience,
        location,
        pet_type,
        size_accepted,
      };

      console.log('BODY ENVIADO:', data);
      await createPetpal(data);

      Alert.alert('Publicación agregada');
      navigation.goBack();
    } catch (error: any) {
      console.log('ERROR AL CREAR PUBLICACIÓN:', error?.response?.data || error);
      Alert.alert('Error', 'No se pudo crear la publicación');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6FFF8' }} edges={['top']}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 20}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="arrow-left" size={26} color="#219653" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Publicación</Text>
          <View style={{ width: 26 }} />
        </View>

        <PetPalPostForm
          initialValues={formValues}
          onSubmit={setFormValues}
          styles={styles}
        />

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit(formValues)}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>

        {posts.length === 0 ? (
          null
        ) : (
          posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={{ marginBottom: 12 }}
              onPress={() => {
                setSelectedPost(post);
                setEditMode(false);
                setEditValues(post);
              }}
              activeOpacity={0.8}
            >
              <PetPalPostCard
                {...post}
                price_per_hour={
                  post.price_per_hour !== '' && post.price_per_hour !== null
                    ? Number(post.price_per_hour)
                    : null
                }
                price_per_day={
                  post.price_per_day !== '' && post.price_per_day !== null
                    ? Number(post.price_per_day)
                    : null
                }
              />
            </TouchableOpacity>
          ))
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F6FFF8', justifyContent: 'center', padding: 18 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#22223B' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#22223B',
    borderWidth: 1,
    borderColor: '#6FCF97'
  },
  button: {
    backgroundColor: '#6FCF97',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#219653',
    fontWeight: 'bold',
  },
});