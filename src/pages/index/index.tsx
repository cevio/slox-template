import React from 'react';
import styles from './index.module.less';
import { Flex } from 'react-flexable';
import { Component, Controller, Middleware } from 'slox';
import { IndexMiddleware } from '../../middlewares/index.middleware';
import { IndexService } from './service';

@Component()
@Controller('/')
@Middleware(IndexMiddleware)
export default class IndexController extends IndexService {
  public render() {
    return <Flex blocked fulled align="center" valign="middle" className={styles.welcome}>
      {this.tips()}
    </Flex>
  }
}