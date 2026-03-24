  //****************************************//
 //                IMPORTS                 //
//****************************************//

import express from "express"
import "dotenv/config"
import { PrismaClient } from "./generated/prisma/client.js"
import { withAccelerate } from "@prisma/extension-accelerate"
import { z, ZodType } from "zod"

  //****************************************//
 //               VARIABLES                //
//****************************************//

const app = express()
const port = 3000
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate())

  //****************************************//
 //                SCHEMAS                 //
//****************************************//

const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: `You need at least 2 characters` })
    .max(20, { message: `You need at most 20 characters` }),
  email: z.string().email(),
  age: z
    .number()
    .int()
    .min(8, { message: "You need to be at least 8 years old" })
    .max(150, { message: "You need to be at most 150 years old" }),
  languages: z.array(z.string()),
})

  //****************************************//
 //                HELPERS                 //
//****************************************//

const sendError = (res: express.Response, stat: number, error: unknown): void => {
  const msg = error instanceof Error ? error.message : String(error)
  res.status(stat).json({ error: msg })
}

const inputValidation = (schema: ZodType, data: unknown, res: express.Response): boolean => {
  const result = schema.safeParse(data)
  if (!result.success) {
    sendError(res, 400, result.error.message)
    return false
  }
  return true
}

  //****************************************//
 //                 ROUTES                 //
//****************************************//

app.use(express.json())

// GET all users
app.get("/userlanguages", async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    sendError(res, 500, error)
  }
})

// GET users by language
app.get("/userlanguages/:language", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        languages: {
          has: req.params.language,
        },
      },
    })
    res.json(users)
  } catch (error) {
    sendError(res, 500, error)
  }
})

// POST new user
app.post("/userlanguages", async (req, res) => {
  if (!inputValidation(userSchema, req.body, res)) return
  try {
    const user = await prisma.user.create({ data: req.body })
    res.json(user)
  } catch (error) {
    sendError(res, 500, error)
  }
})

// UPDATE user languages by email
app.put("/userlanguages/:email", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.params.email },
    })
    if (!user) return sendError(res, 404, new Error("User not found"))
    const updated = await prisma.user.update({
      where: { email: req.params.email },
      data: { languages: [...user.languages, ...req.body.languages] },
    })
    res.json(updated)
  } catch (error) {
    sendError(res, 500, error)
  }
})

// DELETE users under 18
app.delete("/userlanguages", async (req, res) => {
  try {
    const deleted = await prisma.user.deleteMany({
      where: { age: { lt: 18 } },
    })
    res.json({ message: `${deleted.count} users deleted` })
  } catch (error) {
    sendError(res, 500, error)
  }
})

app.listen(3000, () => {
  console.log(`Server listen on port ${port}`)
})