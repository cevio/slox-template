import './style.less';
import React from 'react';
import { createServer } from 'slox';
import NotFound from './404';
import { controllerRegister } from './controllers';

// Middlewares:
import { Authorize } from '@components/common';

// Bootstrap logic code:
const {
  bootstrap,
  defineController,
  useGlobalMiddlewares,
  createNotFoundComponent,
} = createServer();

useGlobalMiddlewares(Authorize);
controllerRegister(defineController);
createNotFoundComponent(() => <NotFound />);
bootstrap('popstate', document.getElementById('root'));