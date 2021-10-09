import React, { useEffect, useMemo } from 'react';
import { Component } from 'slox';
import { LazyCard, Account } from '@components/common';
import { LiveService } from '../../service';
import { Col, message, Row, Statistic, Table } from 'antd';
import styles from './index.module.less';
import { ColumnsType } from 'antd/lib/table';

@Component()
export class Heat extends LiveService {
  public render(props: React.PropsWithoutRef<{ id: number }>) {
    const [invoke, { state, loading }, setFeedback] = this.heat(props.id);
    const total = useMemo(() => state.map(s => s.value).reduce((prev, next) => prev + next, 0), [state]);
    const columns = useMemo(() => this.columns(), []);
    useEffect(() => setFeedback({
      failed: e => message.error(e.message),
    }), [setFeedback]);
    useEffect(() => invoke(), [props.id]);
    return <LazyCard title="直播热度贡献榜" loading={loading}>
      <Row gutter={[16, 16]}>
        <Col span={12}><Statistic className={styles.red} title="上榜人数" value={state.length} suffix="人" /></Col>
        <Col span={12}><Statistic className={styles.yellow} title="累计贡献热度" value={total} /></Col>
        <Col span={24}>
          <div style={{ marginLeft: -8, marginRight: -8, height: 480, paddingTop: 8 }}>
            <Table columns={columns} dataSource={state.slice(0, 10)} pagination={false} rowKey="name" size="small" />
          </div>
        </Col>
      </Row>
    </LazyCard>
  }

  private columns(): ColumnsType<{}> {
    return [
      {
        title: '排名',
        dataIndex:'id',
        align: 'center',
        width: 50,
        className: styles.text,
        render(a, b, i) {
          return i + 1
        }
      },
      {
        title: '观众信息',
        align: 'left',
        render(state: {name: string, value: number, avatar: string}) {
          return <Account size="small" src={state.avatar} name={state.name} style={{ width: 200 }} />
        }
      },
      {
        title: '热度',
        dataIndex: 'value',
        align: 'right',
        className: styles.tred,
        render(num: number) {
          return <span className={styles.hot}>{num}</span>
        }
      },
    ]
  }
}