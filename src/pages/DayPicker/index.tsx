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
  const [state, setState] = useState(dayInfo(week));
  const [nodeIndex, setNodeIndex] = useState<number | null>(state.weekday);

  let operationClassname = classnames('operation', {
    'out-time': 0 >= week,
  });

  // 选中日期
  const selectDay = (index: number, outTime: boolean) => {
    if (outTime) return;

    const chooseDay = state.dateJS
      .add(index - state.weekday, 'day')
      .format('YYYY-MM-DD');
    setNodeIndex(index);

    callback && callback(chooseDay);
  };

  // 改变周
  const changeWeek = (type: Op) => {
    if (type == 'DESC' && week == 0) return;
    setNodeIndex(null);
    callback && callback('');

    switch (type) {
      case 'DESC':
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
      let date = state.date + weekIndex - state.weekday;
      let outTime = (state.weekday - weekIndex > 0 && week == 0) || week < 0; // 是否过期
      let classname = classnames('u-cell', {
        'u-selected': nodeIndex == weekIndex,
        'u-out-time': outTime,
      });

      return (
        <span
          className={classname}
          onClick={() => selectDay(weekIndex, outTime)}
        >
          <div className="header">{item}</div>
          <div>
            {date <= 0
              ? state.dateJS.subtract(state.weekday - weekIndex, 'day').date()
              : date > state.maxDay
              ? date - state.maxDay
              : date}
          </div>
        </span>
      );
    });
  };

  useEffect(() => {
    setState(dayInfo(week));
  }, [week]);

  return (
    <div className="timer">
      <div className="month">{state.month} 月</div>
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
