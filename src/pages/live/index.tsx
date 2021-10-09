import React, { useState } from 'react';
import { Component, Controller, Middleware, redirect, useComponentWithMethod, useParam, inject, useComponent } from 'slox';
import { IndexMiddleware } from '../../middlewares/index.middleware';
import { LayoutContainer } from '@components/common';
import { Affix, Col, Row, Result, Button } from 'antd';
import { Switcher, ComprehensiveDataTrendAnalysis, DimensionDetailedDataAnalysis, Heat } from './components';
import 'antd/es/radio/style/index';
import styles from './index.module.less';

@Component()
@Controller('/live/:id(\\d+)')
@Middleware(IndexMiddleware)
export default class LiveController {
  @inject(Heat) private readonly Heat: Heat;
  @inject(ComprehensiveDataTrendAnalysis) private readonly ComprehensiveDataTrendAnalysis: ComprehensiveDataTrendAnalysis;
  @inject(DimensionDetailedDataAnalysis) private readonly DimensionDetailedDataAnalysis: DimensionDetailedDataAnalysis;
  private readonly renders = {
    data: useComponentWithMethod(this.renderWithData, this),
    interaction: useComponentWithMethod(this.renderWithInteraction, this),
    products: useComponentWithMethod(this.renderWithProducts, this),
  }
  public render() {
    const id = Number(useParam('id', '0'));
    const [type, setType] = useState('data');
    const Renderer = this.renders[type as keyof typeof this.renders];
    if (!id) return <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={() => redirect('/')}>回首页</Button>}
    />
    return <LayoutContainer>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div style={{ width: '100%', height: 500 }}></div>
        </Col>
        <Col span={24}><Affix className={styles.affix} offsetTop={0}><Switcher value={type} onChange={setType}></Switcher></Affix></Col>
        <Col span={24}><Renderer id={id} /></Col>
        <Col span={24}>版权信息</Col>
      </Row>
    </LayoutContainer>
  }

  private renderWithData(props: React.PropsWithoutRef<{ id: number }>) {
    const ComprehensiveDataTrendAnalysis = useComponent(this.ComprehensiveDataTrendAnalysis);
    const DimensionDetailedDataAnalysis = useComponent(this.DimensionDetailedDataAnalysis);
    const Heat = useComponent(this.Heat);
    return <Row gutter={[24, 24]}>
      <Col span={24}><ComprehensiveDataTrendAnalysis id={props.id} /></Col>
      <Col span={16}><DimensionDetailedDataAnalysis id={props.id} /></Col>
      <Col span={8}><Heat id={props.id} /></Col>
    </Row>
  }

  private renderWithInteraction(props: React.PropsWithoutRef<{ id: number }>) {
    return <div>interaction</div>
  }

  private renderWithProducts(props: React.PropsWithoutRef<{ id: number }>) {
    return <div>products</div>
  }
}