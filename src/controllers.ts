import { createServer } from 'slox'
import IndexController from './pages/index';
import LiveController from './pages/live';

export function controllerRegister(defineController: ReturnType<typeof createServer>['defineController']) {
  defineController(IndexController);
  defineController(LiveController);
}