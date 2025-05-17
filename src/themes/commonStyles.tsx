import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAccent: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Baloo2-Bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  buttonTextAccent: {
    color: colors.text,
    fontSize: 18,
    fontFamily: 'Baloo2-Bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
  },
  title: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: 'Baloo2-Bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    color: colors.text,
    fontFamily: 'Baloo2-Bold',
  },
});