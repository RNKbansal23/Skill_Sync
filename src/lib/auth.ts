import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function getUserIdFromRequest(request: Request): Promise<string | null>{
    const cookie = request.headers.get('cookie')
    if(!cookie) return null

    const match = cookie.match(/token=([^;]+)/)
    if (!match) return null

    const token = match[1]

    try{
        const payload = jwt.verify(token, JWT_SECRET) as {userId: string}
        return payload.userId ?? null
    } catch(err) {
        return null
    }

}