 
const messageHandlers = new Set()
export const addMessageHandler = (handler) => {
  messageHandlers.add(handler)
}
export const removeMessageHandler = (handler) => {
  messageHandlers.delete(handler)
}

export const MESSAGE_WS = new WebSocket(`ws://localhost:8000/ws/message/?token=${JSON.parse(localStorage.getItem('auth'))?.access}`);

MESSAGE_WS.onmessage = async (e) => { 
  console.log(messageHandlers)
    messageHandlers.forEach( async (handler) => await handler(e))
} 

const notificationHandlers = new Set()
export const addNotificationHandler = (handler) => {
  notificationHandlers.add(handler)
}
export const removeNotificationHandler = (handler) => {
  notificationHandlers.delete(handler)
}

export const NOTIFICATION_WS = new WebSocket(`ws://localhost:8000/ws/notification/?token=${JSON.parse(localStorage.getItem('auth'))?.access}`);

NOTIFICATION_WS.onmessage = async (e) => { 
    notificationHandlers.forEach( async (handler) => await handler(e))
} 




export const USER_WS = new WebSocket(`ws://localhost:8000/ws/account/users/?token=${JSON.parse(localStorage.getItem('auth'))?.access}`);




export const webSocketDisconnect = () => {

  USER_WS.close()
  MESSAGE_WS.close()
  NOTIFICATION_WS.close()

}

