import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { Component } from 'slox';
import { LiveService } from '../../service';
import { AreaConfig, Area } from '@ant-design/charts';
import { message, Row, Col, Typography, Empty } from 'antd';
import styles from './index.module.less';

interface TConfig {
  id: number,
  subtitle: string,
  unit: string,
  color: string,
  type: number,
}

@Component()
export class ChannelChart extends LiveService {
  public render(props: React.PropsWithoutRef<TConfig & { onLoading: React.Dispatch<React.SetStateAction<boolean>> }>) {
    const [invoke, { state, loading }, setFeedback] = this.dimensionDetailedDataAnalysis(props.id);
    const maxInfo = useMemo(() => {
      const chunks = state.slice().sort((a, b) => { return b.cnt - a.cnt });
      if (chunks.length) return chunks[0];
      return { time: null, cnt: 0 }
    }, [state]);
    const source = useMemo(() => {
      return state.map(s => {
        return {
          time: dayjs(s.time).format('HH:mm'),
          cnt: s.cnt
        }
      })
    }, [state]);
    const configs = useMemo<AreaConfig>(() => {
      return {
        data: source,
        animation: false,
        xField: 'time',
        yField: 'cnt',
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        areaStyle: function areaStyle() {
          return { fill: `l(270) 0:#ffffff 0.5:${props.color} 1:${props.color}` };
        },
        meta: {
          time: { alias: '时间' },
          cnt: { alias: props.subtitle },
        },
        color: props.color,
        smooth:true,
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
    }, [source])
    useEffect(() => setFeedback({
      failed: e => message.error(e.message),
    }), [setFeedback]);
    useEffect(() => invoke(props.type), [props.id, props.type]);
    useEffect(() => props.onLoading(loading), [loading]);
    return !state.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> 
    : <Row gutter={[24, 24]}>
        <Col span={6}>
          <Typography.Paragraph>峰值为</Typography.Paragraph>
          <Typography.Paragraph className={styles.max}><strong style={{ color: props.color }}>{maxInfo.cnt}</strong> <sub>{props.unit}</sub></Typography.Paragraph>
          <Typography.Text className={styles.text}>出现在 <strong>{dayjs(maxInfo.time).format('HH:mm')}</strong></Typography.Text>
        </Col>
        <Col span={18}><Area {...configs} height={120}/></Col>
      </Row>
  }
}