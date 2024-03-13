import asyncio
import websockets


async def handler(websocket, path):
    while True:
        try:
            data = await websocket.recv()
            await websocket.send(data)
        except websockets.ConnectionClosedOK:
            break

recv = websockets.serve(handler, "192.168.0.25", 3000)
asyncio.get_event_loop().run_until_complete(recv)
asyncio.get_event_loop().run_forever()