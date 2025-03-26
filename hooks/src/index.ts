import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const client = new PrismaClient()
app.listen(3000)
app.use(express.json())

app.post('/hooks/catch/:userid/:zapid', async (req, res) => {
    const userid = req.params.userid;
    const zapId = req.params.zapid;
    const body = req.body;

    //store in db a new trigger
    await client.$transaction(async tx => {
        const run = await client.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        })
        await client.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        })
    })
    res.json({
        message:"webhook recieved"
    })
}
)