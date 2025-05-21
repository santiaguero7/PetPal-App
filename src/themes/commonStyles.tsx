import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 18,
    paddingTop: 24,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 14,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonAccent: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: 14,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonTextAccent: {
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
  title: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    color: colors.text,
  },
});