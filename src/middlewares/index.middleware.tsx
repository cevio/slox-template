import React, { useEffect } from 'react';
import { Component } from 'slox';

@Component()
export class IndexMiddleware{
  public render(props: React.PropsWithChildren<{}>) {
    useEffect(() => console.log('Middleware Effected.'), []);
    return props.children as React.ReactElement;
  }
}