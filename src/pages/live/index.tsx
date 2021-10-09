import React, { useState } from 'react';
import { Component, Controller, Middleware, redirect, useComponentWithMethod, useParam, inject, useComponent } from 'slox';
import { LayoutContainer } from '@components/common';
import { Affix, Col, Row, Result, Button } from 'antd';
import 'antd/es/radio/style/index';
import styles from './index.module.less';
import { CopyRight } from '../../components';
import { 
  Switcher, 
  ComprehensiveDataTrendAnalysis, 
  DimensionDetailedDataAnalysis, 
  Heat, 
  Comment, 
  Barrage,
  Reply,
} from './components';

@Component()
@Controller('/live/:id(\\d+)')
export default class LiveController {
  @inject(Heat) private readonly Heat: Heat;
  @inject(Comment) private readonly Comment: Comment;
  @inject(Barrage) private readonly Barrage: Barrage;
  @inject(Reply) private readonly Reply: Reply;
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
        <Col span={24}><CopyRight /></Col>
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
    const Comment = useComponent(this.Comment);
    const Barrage = useComponent(this.Barrage);
    const Reply = useComponent(this.Reply);
    return <Row gutter={[24, 24]}>
      <Col span={24}><Comment id={props.id} /></Col>
      <Col span={12}><Barrage id={props.id} /></Col>
      <Col span={12}><Reply id={props.id} /></Col>
    </Row>
  }

  private renderWithProducts(props: React.PropsWithoutRef<{ id: number }>) {
    return <div>products</div>
  }
}