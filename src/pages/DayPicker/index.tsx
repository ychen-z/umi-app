import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import './index.less';

export type Op = 'DESC' | 'ADD'; // 操作类型

export interface Props {
  currentTime?: string;
  callback?: (day: string) => void;
}

export const weekNodes = ['日', '一', '二', '三', '四', '五', '六'];

// 相对于本周第一天
function dayInfo(next = 0, step = 7) {
  const dateJS = dayjs().add(next * step, 'day'); // 当前日期
  return {
    month: dateJS.month() + 1, // 今日所在月份
    date: dateJS.date(), // 今天几号 + 7 * x
    weekday: dateJS.day(), // 今天星期几
    maxDay: dateJS.daysInMonth(), // 当月最大天数
    today: dayjs().format('YYYY-MM-DD'),
    dateJS,
  };
}

function TimePicker(props: Props) {
  const { callback } = props;
  const [week, setWeek] = useState(0); // 当前周
  const [weekInfo, setWeekInfo] = useState(dayInfo(week));
  const [selectNodeIndex, setSelectNodeIndex] = useState<number>(weekInfo.weekday);
  const [month, SetMonth] = useState(weekInfo.month); // 当前月
  let operationClassname = classnames('operation', {
    'out-time': 0 >= week,
  });

  // 选中日期
  const selectDay = (index: number, outTime: boolean) => {
    if (outTime) return;
    const chooseDay = weekInfo.dateJS
      .add(index - weekInfo.weekday, 'day')
    const formatDate = chooseDay.format('YYYY-MM-DD');
    
    setSelectNodeIndex(index); // 选中的节点
    SetMonth(chooseDay.month() + 1); //选中的节点对应的月份 
    callback && callback(formatDate);
  };

  // 改变周
  const changeWeek = (type: Op) => {
    if (type == 'DESC' && week == 0) return;
    switch (type) {
      case 'DESC':
        if (week === 1 && weekInfo.weekday >= selectNodeIndex) {
          setSelectNodeIndex(weekInfo.weekday); // 当前周选中今天
        }
        setWeek(week - 1);
        break;
      case 'ADD':
        setWeek(week + 1);
        break;
      default:
        break;
    }
  };

  const renderTimerArea = () => {
    return weekNodes.map((item, weekIndex) => {
      let date = weekInfo.date + weekIndex - weekInfo.weekday;
      let outTime = (weekInfo.weekday - weekIndex > 0 && week == 0) || week < 0; // 是否过期
      let classname = classnames('u-cell', {
        'u-selected': selectNodeIndex == weekIndex,
        'out-time': outTime,
      });

      return (
        <span
          className={classname}
          onClick={() => selectDay(weekIndex, outTime)}
        >
          <div className="header">{item}</div>
          <div>
            {date <= 0
              ? weekInfo.dateJS.subtract(weekInfo.weekday - weekIndex, 'day').date()
              : date > weekInfo.maxDay // 是否超过当月最大天数
              ? date - weekInfo.maxDay
              : date}
          </div>
        </span>
      );
    });
  };

  useEffect(() => {
    setWeekInfo(dayInfo(week)); // 更加周确定当前周状态
  }, [week]);

  useEffect(() => {
    selectDay(selectNodeIndex, false); // 根据当前选中天
  }, [weekInfo])

  return (
    <div className="timer">
      <div className="month">{month} 月</div>
      <div className="week">
        <span className={operationClassname} onClick={() => changeWeek('DESC')}>
          -
        </span>
        <div className="timer-area">{renderTimerArea()}</div>
        <span className="operation" onClick={() => changeWeek('ADD')}>
          +
        </span>
      </div>
    </div>
  );
}

export default TimePicker;
