import { LazyCard } from '@components/common';
import React, { useState } from 'react';
import { Component, inject, useComponent } from 'slox';
import { ChannelChart } from '../channel-chart';

@Component()
export class Barrage {
  @inject(ChannelChart) private readonly ChannelChart: ChannelChart;
  public render(props: React.PropsWithoutRef<{ id: number }>) {
    const [loading, setLoading] = useState(false);
    const ChannelChart = useComponent(this.ChannelChart);
    return <LazyCard title="上墙趋势" loading={loading} tip="直播期间某一时刻，观众发表评论被主播上墙的条数变化，或有不准仅供参考">
      <ChannelChart id={props.id} subtitle="条数" unit="条" color="#FA5151" type={4} onLoading={setLoading} />
    </LazyCard>
  }
}