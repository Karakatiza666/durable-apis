import { DurableInit, DurableInitFunction, EmptyObj } from "./types"

type DurableWS = {
   sendTo(tags: string[] | 'all', message: string | ArrayBuffer | ArrayBufferView
): void
   close(tags: string[] | 'all'): void
   upgrade: (getTags: (request: Request) => string[] | null) => (request: Request) => Response
}

export const durableWS = <Env extends EmptyObj, T extends Object>(
   durableWS: (cws: DurableWS) => DurableInit<Env, T>
): DurableInitFunction<Env, T> => (state, env) => {
   const cws = {
      sendTo(tags: string[] | 'all', message: string | ArrayBuffer | ArrayBufferView) {
         (tags === 'all'
            ? state.getWebSockets()
            : tags.flatMap(tag => state.getWebSockets(tag))
         ).forEach(w => w.send(message))
      },
      close(tags: string[] | 'all') {
         (tags === 'all'
            ? state.getWebSockets()
            : tags.flatMap(tag => state.getWebSockets(tag))
         ).forEach(w => w.close())
      },
      upgrade: (getTags: (request: Request) => string[] | null) => (request: Request) => {
         const upgradeHeader = request.headers.get('Upgrade');
         if (!upgradeHeader || upgradeHeader !== 'websocket') {
           return new Response('Expected Upgrade: websocket', { status: 426 });
         }
         const tags = getTags(request)
         if (!tags) {
            return new Response('Cannot Upgrade: Bad Request', { status: 400 });
         }
      
         const {0: client, 1: server} = new WebSocketPair();

         state.acceptWebSocket(server, tags)
         server.serializeAttachment(tags)

         return new Response(null, {
            status: 101,
            webSocket: client,
         });
      }
   }

   const api = (durableWS(cws) as DurableInitFunction<Env, T>)(state, env)

   return {
      ...api,
      // webSocketMessage(ws: WebSocket, message: String | ArrayBuffer) {

      // },
      // webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {

      // },
      // webSocketError(ws: WebSocket, error: any) {

      // }
   }
}