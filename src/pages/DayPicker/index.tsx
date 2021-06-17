import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import './index.less';

export type OpProps = 'DESC' | 'ADD'; // 操作类型
export interface TimePickerProps {
  currentTime?: string | undefined;
  delayFlag?: boolean;
  manual?: boolean;
  callback?: (data: TimePickerProps) => void;
}

export const weekNodes = ['日', '一', '二', '三', '四', '五', '六'];

/**
 *
 * @param next 周，比如当前周
 * @param step 步长
 * @returns 日期对象
 */
function dayInfo(diff: number) {
  const dateJS = dayjs().add(diff, 'day'); // 当前日期
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
 * @param currentTime 初始化时间搓 时间格式 2021-01-01
 * @returns
 */
function initdaysInfo(currentTime: string) {
  const diffdays = currentTime
    ? dayjs(currentTime).diff(dayInfo(0).today, 'day')
    : 0; // 与今天相隔多久

  return {
    diffdays,
    diffWeeks: Number((diffdays / 7).toFixed(0)),
  };
}
/**
 *
 * @param props
 * @returns
 */
function TimePicker(props: TimePickerProps) {
  const {
    callback,
    currentTime = '',
    delayFlag = false,
    manual = false,
  } = props;
  const [flag, setFlag] = useState(delayFlag); // 是否候选
  const firstEntry = useRef(0); // 首次进入
  const [diffDaysInfo, setDiffDaysInfo] = useState(initdaysInfo(currentTime));
  const [weekInfo, setWeekInfo] = useState(dayInfo(diffDaysInfo.diffdays));
  const [month, SetMonth] = useState(weekInfo.month); // 当前月
  const [selectNodeIndex, setSelectNodeIndex] = useState<any>(weekInfo.weekday);

  let operationClassname = classnames('operation', {
    'out-time': 0 >= diffDaysInfo.diffWeeks,
  });

  /**
   *
   * @param index 索引
   * @param expire 是否过期
   * @returns callback 暴露 currentTime & flag 给上层
   */
  const selectDay = (index: number, expire: boolean) => {
    // 选中
    const chooseDay = weekInfo.dateJS.add(index - weekInfo.weekday, 'day');
    const formatDate = chooseDay.format('YYYY-MM-DD');
    // 过期
    if (expire) {
      setSelectNodeIndex(null); // 置空
    } else {
      setSelectNodeIndex(index); // 选中的节点
    }

    SetMonth(chooseDay.month() + 1); //选中的节点对应的月份

    callback &&
      firstEntry.current > 0 &&
      callback({
        currentTime: expire ? '' : formatDate,
        flag,
      });
  };

  const clickSelectDay = (index: number, expire: boolean) => {
    firstEntry.current++;
    selectDay(index, expire);
  };

  /**
   *
   * @param type 上一周 desc ; 下一周 add
   * @returns
   */
  const changeWeek = (type: OpProps) => {
    // 当前周 且向下无法往下选择
    if (type == 'DESC' && diffDaysInfo.diffWeeks <= 0) return;
    firstEntry.current++;
    switch (type) {
      case 'DESC':
        setDiffDaysInfo({
          diffdays:
            diffDaysInfo.diffWeeks - 1 == 0 ? 0 : diffDaysInfo.diffdays - 7,
          diffWeeks:
            diffDaysInfo.diffWeeks - 1 == 0 ? 0 : diffDaysInfo.diffWeeks - 1,
        });
        break;
      case 'ADD':
        setDiffDaysInfo({
          diffdays:
            diffDaysInfo.diffWeeks + 1 == 0 ? 0 : diffDaysInfo.diffdays + 7,
          diffWeeks:
            diffDaysInfo.diffWeeks + 1 == 0 ? 0 : diffDaysInfo.diffWeeks + 1,
        });
        break;
      default:
        break;
    }
  };

  /**
   *
   * @returns 返回cell对象
   */
  const renderTimerArea = () => {
    return weekNodes.map((item, weekIndex) => {
      let date = weekInfo.date + weekIndex - weekInfo.weekday;
      let expire =
        (weekInfo.weekday - weekIndex > 0 && diffDaysInfo.diffWeeks == 0) ||
        diffDaysInfo.diffWeeks < 0; // 是否过期
      let classname = classnames('u-cell', {
        'u-selected': selectNodeIndex == weekIndex,
        'out-time': expire,
      });

      return (
        <span
          className={classname}
          onClick={!expire ? () => clickSelectDay(weekIndex, expire) : () => {}}
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
    setWeekInfo(dayInfo(diffDaysInfo.diffdays));
  }, [diffDaysInfo]);

  useEffect(() => {
    SetMonth(weekInfo.month);

    selectDay(
      diffDaysInfo.diffWeeks == 0 ? weekInfo.weekday : selectNodeIndex,
      diffDaysInfo.diffWeeks < 0 && firstEntry.current > 0 ? true : false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekInfo]);

  useEffect(() => {
    if (firstEntry.current) {
      selectDay(selectNodeIndex, false); // 根据当前选中天
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);

  return (
    <div className="m-timer-picker">
      {manual && <div className="u-mask" />}
      <div className="u-timer">
        {flag && <div className="u-timer-mask" />}
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
        <Checkbox
          onChange={(e: CheckboxChangeEvent) => {
            firstEntry.current++;
            setFlag(e.target.checked);
          }}
          defaultChecked={flag}
        >
          暂不确定日期和时间，先设置评委，稍后再安排具体日期和时间
        </Checkbox>
      </div>
    </div>
  );
}

export default TimePicker;
