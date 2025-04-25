import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
import { ComponentRef, Injectable } from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: RootHandler } = {};
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.isDetachable(route);
  }

  store(route: ActivatedRouteSnapshot, handler: DetachedRouteHandle) {
    const storeKey =  this.getStoreKey(route);
    if (handler) {
      const rootHandler = {
        handle: handler,
        storeTime: +new Date()
      };
      this.handlers[storeKey] = rootHandler;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const storeKey =  this.getStoreKey(route);
    if (this.isAtachable(route, storeKey)) {
      // retrun true only
      // delete unnecessary stored route to save memory.
      this.clearNewerHandlerOnAttach(this.handlers[storeKey].storeTime);
      return true;
    }
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const storeKey =  this.getStoreKey(route);
    return this.handlers[storeKey]?.handle;
  }

  shouldReuseRoute( future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === current.routeConfig;
  }

  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
  }

  private getStoreKey(route: ActivatedRouteSnapshot): string {
    const baseUrl = this.getResolvedUrl(route);
    const childrenParts = [];
    let deepestChild = route;
    while (deepestChild.firstChild) {
        deepestChild = deepestChild.firstChild;
        childrenParts.push(deepestChild.url.join('/'));
    }
    return baseUrl + '////' + childrenParts.join('/');
  }

  // true if by marking the route with shouldDetach:true
  private isDetachable(route: ActivatedRouteSnapshot) {
    if ( route?.routeConfig?.data?.shouldDetach) {
      return true;
    }
    return false;
  }

  private isAtachable(route: ActivatedRouteSnapshot, storeKey: string) {
    if (this.isDetachable(route) && this.handlers[storeKey]?.handle) {
      return true;
    }
    return false;
  }

  /*
  When the user goes back (attach a root)
  */
  private clearNewerHandlerOnAttach(storeTime: number) {
    const handlerKeys = Object.keys(this.handlers);
    handlerKeys.forEach(k => {
      if (this.handlers[k].storeTime > storeTime) {
        const componentRef: ComponentRef<any> = (this.handlers[k].handle as any).componentRef;
        if (componentRef) {
          componentRef.destroy();
        }
        delete this.handlers[k];
      }
    });
  }
}

export interface RootHandler {
  handle: DetachedRouteHandle;
  storeTime: number;
}