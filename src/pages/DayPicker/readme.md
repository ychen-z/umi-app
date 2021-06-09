## use

### 按照依赖

~ yarn add dayjs

```
import DayPicker, { TimePickerProps } from "./DayPicker"

const [info, setInfo] = useState<TimePickerProps>({})
  
const showDay = (data: TimePickerProps)=>{
    setInfo(data)
}

<DayPicker callback={ showDay } flag={true} currentTime={"2021-5-21"} />
     
```

### 调整 图标
