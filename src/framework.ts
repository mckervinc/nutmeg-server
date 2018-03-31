export interface Response {
    data?: object,
    status: number,
    message?: string
}

export type Method = 'post' | 'get' | 'delete' | 'patch' | 'put';

export type AnyCallbackFunction = (...args: any[]) => any

export interface Route {
    method: Method,
    callback: AnyCallbackFunction,
    route: string,
    validator?: any[]
}