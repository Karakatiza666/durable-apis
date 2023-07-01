
export type EmptyObj = {[key: string]: any};
export type Object = Record<string, any>;
export type DurableType<T> = T & Partial<{
  alarm: () => void | Promise<void>,
  fetch: (request: Request) => Response | Promise<Response>
}>
export type DurableInitConstructor<Env, T> = {new (state: DurableObjectState, env: Env): DurableType<T>};
export type DurableInitFunction<Env, T> = (state: DurableObjectState, env: Env) => DurableType<T>;

export interface BasicDurable<Env = EmptyObj> {
  (state: DurableObjectState, env: Env): {
    fetch: (request: Request) => Response | Promise<Response>;
  };
}

export type PromisifiedObject<T> = {
  [K in keyof T]: T[K] extends (...args: any) => Promise<any>
    ? T[K]
    : T[K] extends (...args: infer A) => any
    ? (...args: A) => Promise<ReturnType<T[K]>>
    : T[K];
}

export type DurableAPIStub<T> = DurableObjectStub & PromisifiedObject<T>;


export type DurableInit<Env = EmptyObj, T extends Object = Object> =
  DurableInitConstructor<Env, T> | DurableInitFunction<Env, T>;