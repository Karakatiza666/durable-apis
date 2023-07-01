import { DurableInit, BasicDurable, DurableInitFunction } from "./types"

type CloudflareWS = {
   sendTo(tags: string[], message: string): void
   closeAt(tags: string[]): void
}

// export const cloudflareWS<Env, T extends Object>(durableWS: (wss: CloudflareWS) => DurableInit<Env, T>): BasicDurable<Env> => {
//    const wss = {}
//    return (state, env) => {
//       const api = (durableWS(wss) as DurableInitFunction<Env, T>)(state, env)
//       return {
//          ...api
//       }
//    }
// }