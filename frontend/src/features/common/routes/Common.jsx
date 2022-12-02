import React, { useEffect } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { gaPageView } from '@/utils/misc/analytics';
import LaunchPad from '@/features/common/components/LaunchPad';

function CommonPage() {
  useEffect(() => {
    gaPageView();
  }, []);

  return (
    <CommonLayout>
      <LaunchPad />
    </CommonLayout>
  );
}

export default CommonPage;