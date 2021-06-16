import React from 'react';
import { useRequest, useIntl } from 'umi';
import Mock from 'mockjs';

console.log(Mock.mock('@name'));

function getUsername(): Promise<string> {
  return new Promise((resolve) => {
    resolve(Mock.mock('@name'));
  });
}

export default function IndexPage() {
  const { data, error, loading } = useRequest(() => getUsername(), {
    manual: false,
    onSuccess: (data) => {
      console.log(data);
    },
  });
  const intl = useIntl();
  if (error) {
    return <div>failed to load</div>;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <>
      <div>
        {intl.formatMessage(
          {
            id: '_xx_',
          },
          {
            name: data,
            a: 's',
          },
        )}
      </div>

      <div>Username: {data}</div>
    </>
  );
}
