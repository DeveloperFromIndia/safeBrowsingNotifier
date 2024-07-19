import { MainKeyboard } from "../keyboards/main-keyboard.js"


export const start = async(ctx) => {
    console.log(ctx.message.from.id)
    ctx.replyWithHTML("new user is here!", MainKeyboard)
}