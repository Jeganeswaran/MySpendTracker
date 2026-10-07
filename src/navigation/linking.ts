import { Linking } from 'react-native';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
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
          Analytics: 'analytics',
          Settings: 'settings',
        },
      },
      AddExpense: 'add-expense',
      AddIncome: 'add-income',
      Search: 'search',
      Notifications: 'notifications',
      Calendar: 'calendar',
      TransactionSettings: 'transaction-settings',
      RepeatSettings: 'repeat-settings',
      IncomeCategories: 'income-categories',
      ExpenseCategories: 'expense-categories',
      Accounts: 'accounts',
      Language: 'language',
    },
  },
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
