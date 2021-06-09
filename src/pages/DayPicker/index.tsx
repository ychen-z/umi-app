import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import './index.less';

export type OpProps = 'DESC' | 'ADD'; // 操作类型

export interface TimePickerProps {
  currentTime?: string | undefined;
  flag?: boolean;
  callback?: (data: TimePickerProps) => void;
}

export const weekNodes = ['日', '一', '二', '三', '四', '五', '六'];

/**
 *
 * @param next 周，比如当前周
 * @param step 步长
 * @returns 日期对象
 */
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

/**
 *
 * @param props
 * @returns
 */
function TimePicker(props: TimePickerProps) {
  const { callback, currentTime } = props;
  const diffdays = currentTime
    ? dayjs(currentTime).diff(dayInfo(0).today, 'day')
    : 0; // 与今天相隔多久
  const [week, setWeek] = useState(Number((diffdays / 7).toFixed(0))); // 当前周
  const [flag, setFlag] = useState(props.flag || false); // 当前周
  const [weekInfo, setWeekInfo] = useState(dayInfo(diffdays, 1));
  const [selectNodeIndex, setSelectNodeIndex] = useState<number>(
    weekInfo.weekday,
  );
  const [month, SetMonth] = useState(weekInfo.month); // 当前月

  let operationClassname = classnames('operation', {
    'out-time': 0 >= week,
  });

  /**
   *
   * @param index 索引
   * @param outTime 是否过期
   * @returns callback 暴露 currentTime & flag 给上层
   */
  const selectDay = useCallback(
    (index: number, outTime: boolean) => {
      if (outTime) return;
      const chooseDay = weekInfo.dateJS.add(index - weekInfo.weekday, 'day');
      const formatDate = chooseDay.format('YYYY-MM-DD');

      setSelectNodeIndex(index); // 选中的节点
      SetMonth(chooseDay.month() + 1); //选中的节点对应的月份
      callback &&
        callback({
          currentTime: formatDate,
          flag,
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   *
   * @param type 上一周 desc ; 下一周 add
   * @returns
   */
  const changeWeek = (type: OpProps) => {
    // 当前周 且向下无法往下选择
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

  /**
   * 选择
   */
  const changeCheckbox = (e: CheckboxChangeEvent) => {
    setFlag(e.target.checked);
  };

  /**
   *
   * @returns 返回cell对象
   */
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
              ? weekInfo.dateJS
                  .subtract(weekInfo.weekday - weekIndex, 'day')
                  .date()
              : date > weekInfo.maxDay // 是否超过当月最大天数
              ? date - weekInfo.maxDay
              : date}
          </div>
        </span>
      );
    });
  };

  useEffect(() => {
    setWeekInfo(dayInfo(week));
  }, [week]);

  useEffect(() => {
    selectDay(selectNodeIndex, false); // 根据当前选中天
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectNodeIndex]);

  return (
    <div className="m-timer-picker">
      <div className="u-timer">
        <div className="month">{month} 月</div>
        <div className="week">
          <span
            className={operationClassname}
            onClick={() => changeWeek('DESC')}
          >
            -
          </span>
          <div className="timer-area">{renderTimerArea()}</div>
          <span className="operation" onClick={() => changeWeek('ADD')}>
            +
          </span>
        </div>
      </div>
      <div className="u-footer">
        <Checkbox onChange={changeCheckbox} defaultChecked={flag}>
          {' '}
          暂不确定日期和时间，先设置评委，稍后再安排具体日期和时间
        </Checkbox>
      </div>
    </div>
  );
}

export default TimePicker;
