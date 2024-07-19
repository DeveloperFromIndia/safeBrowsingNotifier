import { MainKeyboard } from "../keyboards/main-keyboard.js"
import UserService from "../services/user-service.js"

export const start = async(ctx) => {
    const userMessage = ctx.message; 
    await UserService.firstStart(userMessage.from.id, userMessage.from.username)
    
    ctx.replyWithHTML("new user is here!", MainKeyboard)
}