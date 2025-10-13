import { RouteObject } from 'react-router-dom';

export interface CustomRouteObject extends Omit<RouteObject, 'children'> {
  title?: string;
  children?: CustomRouteObject[];
}
