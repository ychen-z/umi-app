import styles from './index.less';
import DayPicker, { TimePickerProps } from './DayPicker';
import { useState } from 'react';

export default function IndexPage() {
  const [info, setInfo] = useState<TimePickerProps>({});

  const showDay = (data: TimePickerProps) => {
    setInfo(data);
  };

  return (
    <div>
      <DayPicker callback={showDay} flag={true} currentTime={'2021-5-21'} />
      <div>你选中的是：{info.currentTime} </div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
