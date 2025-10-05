import ContentWrapper from '@/components/ui/ContentWrapper/ContentWrapper';
import { SettingsScreen } from '@/screens/settings/Settings';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Settings',
};

export default function Settings() {
  return (
    <ContentWrapper>
      <SettingsScreen />
    </ContentWrapper>
  );
}
