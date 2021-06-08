import styles from './index.less';
import DayPicker from "./DayPicker"
import { useState } from 'react';


export default function IndexPage() {
  const [day, setDay] = useState('')
  
  const showDay = (day:string)=>{
    setDay(day)
  }

  return (
    <div>
      <DayPicker callback={showDay}/>
      <div>你选中的是：{day}</div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
