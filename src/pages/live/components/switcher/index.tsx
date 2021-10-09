import { Tabs } from 'antd';
import React from 'react';
import styles from './index.module.less';
import classnames from 'classnames';
import { Icon } from '@components/common';
const { TabPane } = Tabs;
export function Switcher(props: React.PropsWithoutRef<{ value: string, onChange: React.Dispatch<React.SetStateAction<string>> }>) {
  return <div className={styles.tabs}>
    <Tabs activeKey={props.value} onChange={props.onChange} className={styles['tab-active-' + props.value]}>
      <TabPane tab={<span className={classnames(styles.tabIcon, styles.tabIconData)}><Icon type="bz-zhibo" />直播数据分析</span>} key="data"></TabPane>
      <TabPane tab={<span className={classnames(styles.tabIcon, styles.tabIconInteraction)}><Icon type="bz-guanzhong" />观众互动分析</span>} key="interaction"></TabPane>
      <TabPane tab={<span className={classnames(styles.tabIcon, styles.tabIconProducts)}><Icon type="bz-daihuo" />带货商品分析</span>} key="products"></TabPane>
    </Tabs>
  </div>
}