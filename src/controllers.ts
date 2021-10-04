import { createServer } from 'slox'
import IndexController from './pages/index';

export function controllerRegister(defineController: ReturnType<typeof createServer>['defineController']) {
  defineController(IndexController);
}