import { Spin, Space, Tooltip } from 'antd';
import React, { Fragment, useState } from 'react';
import { Component, useComponentWithMethod, inject, useComponent } from 'slox';
import styles from './index.module.less';
import classnames from 'classnames';
import { QuestionCircleFilled } from '@ant-design/icons';
import { ChannelChart } from '../channel-chart';

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
export class DimensionDetailedDataAnalysis {
  @inject(ChannelChart) private readonly ChannelChart: ChannelChart;
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
    const [loading, setLoading] = useState(false);
    const ChannelChart = useComponent(this.ChannelChart);
    return <Fragment>
      <div className="com-lazy-card-head">
        <Space>
          <span className="com-lazy-card-head-title">{props.title}</span>
          {props.tip && <Tooltip title={props.tip}><QuestionCircleFilled className="com-lazy-card-icon" /></Tooltip>}
        </Space>
      </div>
      <div className="com-lazy-card-body">
        <Spin spinning={loading}>
          <ChannelChart id={props.id} subtitle={props.subtitle} unit={props.unit} color={props.color} type={props.type} onLoading={setLoading} />
        </Spin>
      </div>
    </Fragment>
  }
}