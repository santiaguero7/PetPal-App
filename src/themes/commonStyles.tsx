import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'colors.background',
    padding: 18,
    paddingTop: 24,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    color: colors.text,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary, 
    marginBottom: 4,
    letterSpacing: 0.5,
    textAlign: 'left',
    fontFamily: 'System', // O la fuente que prefieras
  },
  screenSubtitle: {
    color: '#4b5563', // Gris oscuro, más estilo subtítulo
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'left',
    fontWeight: '400',
    fontStyle: 'italic',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#22223B',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  caretakerName: {
    fontWeight: 'bold',
    color: '#22223B',
    fontSize: 16,
    marginBottom: 2,
  },
});