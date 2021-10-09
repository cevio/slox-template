import { Typography } from 'antd';
import React from 'react';
import { Flex } from 'react-flexable';
import styles from './index.module.less';

export function CopyRight() {
  return <Flex blocked align="center" valign="middle" direction="column" className={styles.container}>
    <Typography.Text>粤ICP备2021004808号-2，深圳百准信息科技有限公司，All Rights Reserved.</Typography.Text>
    <Typography.Text>数据来源于微信视频号，仅进行分析，仅供参考</Typography.Text>
  </Flex>
}