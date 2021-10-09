import { LazyCard } from '@components/common';
import React, { useState } from 'react';
import { Component, inject, useComponent } from 'slox';
import { ChannelChart } from '../channel-chart';

@Component()
export class Comment {
  @inject(ChannelChart) private readonly ChannelChart: ChannelChart;
  public render(props: React.PropsWithoutRef<{ id: number }>) {
    const [loading, setLoading] = useState(false);
    const ChannelChart = useComponent(this.ChannelChart);
    return <LazyCard title="观众评论趋势" loading={loading} tip="直播期间某一时刻，观众发表评论条数变化，或有不准仅供参考">
      <ChannelChart id={props.id} subtitle="条数" unit="条" color="#13BF89" type={2} onLoading={setLoading} />
    </LazyCard>
  }
}