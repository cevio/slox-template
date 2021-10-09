import { Col, message, Row, Spin, Empty, Typography, Space, Tooltip } from 'antd';
import React, { Fragment, useEffect, useMemo } from 'react';
import { Component, useComponentWithMethod } from 'slox';
import { LiveService } from '../../service';
import { AreaConfig, Area } from '@ant-design/charts';
import dayjs from 'dayjs';
import styles from './index.module.less';
import classnames from 'classnames';
import { QuestionCircleFilled } from '@ant-design/icons';

interface TConfig {
  title: string,
  subtitle: string,
  unit: string,
  time: string,
  color: string,
  type: number,
  tip?: string,
}

@Component()
export class DimensionDetailedDataAnalysis extends LiveService {
  private readonly configs: TConfig[] = [
    {
      title:"进入直播间趋势",
      subtitle:"人数",
      unit:'人',
      time:'2021-09-15 13:09:50',
      color:'#1485EE',
      type:1,
      tip: '直播期间某一时刻，进入直播间的观众人数变化，或有不准仅供参考'
    },
    {
      title:"正在买趋势",
      subtitle:"人数",
      unit:'人',
      time:'2021-09-15 13:09:50',
      color:'#FA5151',
      type:0,
      tip: '直播期间某一时刻，观众去查看、购买商品的人次变化，或有不准仅供参考'
    },
    {
      title:"礼物趋势图",
      subtitle:"次数",
      unit:'次',
      time:'2021-09-15 13:09:50',
      color:'#FA9D3B',
      type:3,
      tip: '直播期间某一时刻，观众赠送主播礼物的次数变化，或有不准仅供参考'
    }
  ]
  public render(props: React.PropsWithoutRef<{ id: number }>) {
    const Channel = useComponentWithMethod(this.channel, this);
    return <div className={classnames('com-lazy-card', styles.lazycard)}>
      {this.configs.map((config, index) => <Channel id={props.id} {...config} key={index} />)}
    </div>
  }

  private channel(props: React.PropsWithoutRef<TConfig & { id: number }>) {
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
    return <Fragment>
      <div className="com-lazy-card-head">
        <Space>
          <span className="com-lazy-card-head-title">{props.title}</span>
          {props.tip && <Tooltip title={props.tip}><QuestionCircleFilled className="com-lazy-card-icon" /></Tooltip>}
        </Space>
      </div>
      <div className="com-lazy-card-body">
        <Spin spinning={loading}>
          {
            state.length
              ? <Row gutter={[24, 24]}>
                  <Col span={6}>
                    <Typography.Paragraph>峰值为</Typography.Paragraph>
                    <Typography.Paragraph className={styles.max}><strong style={{ color: props.color }}>{maxInfo.cnt}</strong> <sub>{props.unit}</sub></Typography.Paragraph>
                    <Typography.Text className={styles.text}>出现在 <strong>{dayjs(maxInfo.time).format('HH:mm')}</strong></Typography.Text>
                  </Col>
                  <Col span={18}><Area {...configs} height={120}/></Col>
                </Row>
              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Spin>
      </div>
    </Fragment>
  }
}