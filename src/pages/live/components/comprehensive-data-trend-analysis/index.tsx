import { Col, message, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { Component, useComponentWithMethod } from 'slox';
import { LiveService } from '../../service';
import { LazyCard, TotalIncrement } from '@components/common';
import { AreaConfig, DualAxes, Area, DualAxesConfig } from '@ant-design/charts';
import type { TLiveBaseDataState } from '../../interface';

@Component()
export class ComprehensiveDataTrendAnalysis extends LiveService {
  public render(props: React.PropsWithoutRef<{ id: number }>) {
    const [value, setValue] = useState(1);
    const [invoke, { state, loading }, setFeedback] = this.comprehensiveDataTrendAnalysis(props.id);
    const lookText = value === 1 ? '新增观看人数' : '观看人数';
    const [a1, a2] = useMemo(() => this.formatBaseState(state, lookText, value), [state, value, lookText]);
    const leaves = useMemo(() => this.formatLeaveState(state), [state]);
    const MainChart = useComponentWithMethod(this.mainChart, this);
    const ExtraChart = useComponentWithMethod(this.extraChart, this);
    useEffect(() => setFeedback({
      failed: (e) => message.error(e.message),
    }), [setFeedback]);
    useEffect(() => invoke(), [props.id]);
    return <Row gutter={[24, 24]}>
      <Col span={24}>
        <LazyCard title="综合数据趋势分析" extra={<TotalIncrement value={value} onChange={setValue} />} loading={loading}>
          <MainChart lookText={lookText} a1={a1} a2={a2} />
        </LazyCard>
      </Col>
      <Col span={24}>
        <LazyCard title="直播各时段观众留存率" loading={loading} tip="留存率 = 新增在线人数 / 新增观看人数">
          <ExtraChart dataSource={leaves} />
        </LazyCard>
      </Col>
    </Row>
  }

  private formatBaseState(state: TLiveBaseDataState[], lookText: string, type: number) {
    // @ts-ignore
    const a1: { time: string, [lookText]: number }[] = [];
    const a2: { time: string, count: number, name: string }[] = [];
    state.forEach(val => {
      a1.push({ time: dayjs(val.time).format('HH:mm'), [lookText]: Number(type === 1 ? val.lookDelta : val.lookCount) });
      a2.push({ time: dayjs(val.time).format('HH:mm'), count: Number(type === 1 ? val.onlineDelta : val.onlineCount), name: type === 1 ? '新增在线人数' : '在线人数' });
      a2.push({ time: dayjs(val.time).format('HH:mm'), count: Number(type === 1 ? val.likeDelta :val.likeCount), name: type === 1 ? '新增喝彩数' : '喝彩数' });
      a2.push({ time: dayjs(val.time).format('HH:mm'), count: Number(type === 1 ? val.heatDelta : val.heat), name: type === 1 ? '新增热度' : '热度' });
    });
    return [a1, a2] as const;
  }

  private formatLeaveState(state: TLiveBaseDataState[]) {
    return state.map((s) => {
      const time = dayjs(s.time).format('HH:mm');
      if (s.lookDelta === 0) return {
        x: time,
        y: 0
      };
      const x = s.onlineDelta / s.lookDelta;
      return {
        x: time,
        y: Number((x * 100).toFixed(2))
      }
    })
  }

  private mainChart(props: React.PropsWithoutRef<{
    lookText: string,
    a1: { time: string }[],
    a2: { time: string; count: number; name: string; }[]
  }>) {
    const configs: DualAxesConfig = {
      data: [props.a1, props.a2],
      xField: 'time',
      height: 250,
      yField: [props.lookText, 'count'],
      limitInPlot: false,
      yAxis: { count:false },
      geometryOptions: [
        {
          geometry: 'column',
          columnWidthRatio: 0.4,
          color: '#13BF89',
          columnStyle: {
            radius: [50, 50, 0, 0],
          }
        },
        {
          geometry: 'line',
          seriesField: 'name',
          smooth:true,
          color: ['#0586F7', '#DF04FC', '#FC6404']
        },
      ]
    }
    return <DualAxes {...configs} style={{ width: '100%' }} />
  }

  private extraChart(props: React.PropsWithoutRef<{ dataSource: { x: string, y: number }[] }>) {
    const config: AreaConfig = {
      data: props.dataSource,
      animation: false,
      xField: 'x',
      yField: 'y',
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      areaStyle: function areaStyle() {
        return { fill: 'l(270) 0:#ffffff 0.5:#FA9D3B 1:#FA9D3B' };
      },
      meta: {
        x: { alias: '时间' },
        y: { alias: '留存率' },
      },
      color: '#FA9D3B',
      smooth:true,
      tooltip: {
        formatter: (dat: any) => {
          return {
            name: '留存率',
            value: dat.y + '%'
          }
        }
      },
      yAxis: {
        // grid 配置水平线的样式 下面配置为虚线如果要为实线，不用配置
       grid: {
         line: {
           style: {
             stroke: '#EBEEF5',
             lineDash: [4, 5],
           },
         },
       },
     },
     // @ts-ignore
     xAxis: {
       line: { style: { stroke: '#DCDFE6' } },
       tickLine:null
     },
    };
    return <Area {...config} height={150} />;
  }
}