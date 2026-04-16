import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MobileErrorBoundaryProps, MobileErrorBoundaryState } from './error-boundary.types';

export class MobileErrorBoundary extends Component<
  Readonly<MobileErrorBoundaryProps>,
  MobileErrorBoundaryState
> {
  override state: MobileErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error): MobileErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Mobile app render error', { error, errorInfo });
  }

  override render(): ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Ripples</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.body}>
          The app hit a recoverable rendering error. Try again, or restart the dev session if it
          repeats.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => this.reset()}>
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  private reset(): void {
    this.setState({ error: undefined });
  }
}

const styles = StyleSheet.create({
  body: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#143055',
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  eyebrow: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});
