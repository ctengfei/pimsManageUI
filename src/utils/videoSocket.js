export function sendMessage(method, body){
    console.log('sendMessage', this.client)
    if (this.client) {
        this.client.send(JSON.stringify({
            func: method,
            msg: body
        }))
    }
}