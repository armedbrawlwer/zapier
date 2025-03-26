import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();
const TOPIC_NAME = 'zap-events';

const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ['localhost:9092']
});

async function main() {

    const producer = kafka.producer();
    await producer.connect();
    while (1) {
        const pending_rows = await client.zapRunOutbox.findMany({
            where: {},
            take: 10
        })

        //publish pending rows in kafka
        producer.send({
            topic: TOPIC_NAME,
            messages:
                pending_rows.map(r => ({
                    value: r.zapRunId
                }))
        })

        //delete entries from outbox
        await client.zapRunOutbox.deleteMany({
            where:{
                id:{
                    in: pending_rows.map(x=>x.id)
                }
            }
        })
    }
}
main();
