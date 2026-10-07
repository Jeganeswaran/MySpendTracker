/**
 * MySpendTracker — Deep Linking Config
 * ------------------------------------
 * Lets URLs open specific screens: myspendtracker://add-expense
 */

import { Linking } from 'react-native';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  // Removed Expo's Linking.createURL('/') since React Native CLI handles schemes manually
  prefixes: ['myspendtracker://', 'https://myspendtracker.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Onboarding: 'onboarding',
          Login: 'login',
          Signup: 'signup',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Transactions: 'transactions',
          Budget: 'budget',
          Settings: 'settings',
        },
      },
      AddExpense: 'add-expense',
      Search: 'search',
      Notifications: 'notifications',
    },
  },
  // Explicit subscribers to ensure background and killed app states handle URLs perfectly in CLI
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);
    const subscription = Linking.addEventListener('url', onReceiveURL);

    return () => {
      subscription.remove();
    };
  },
};
