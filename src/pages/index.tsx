import React, { useState } from 'react';
import styles from './index.less';
import DayPicker, { TimePickerProps } from './DayPicker';

export default function IndexPage() {
  const [info, setInfo] = useState<TimePickerProps>({});

  const showDay = (data: TimePickerProps) => {
    console.log(data);
    setInfo(data);
  };

  return (
    <div>
      <DayPicker callback={showDay} flag currentTime="2021-07-18" />
      <div>你选中的是：{info.currentTime} </div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
