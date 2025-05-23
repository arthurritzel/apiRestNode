import amqp from 'amqplib';
import { v4 } from 'uuid';

const exchange = 'processExchange'; // Você pode manter o mesmo exchange para ambos
const routingKeys = {
  task: 'taskQueue',
  order: 'orderQueue',
  debt: 'debtQueue' 
};

export default async (eventType, data) => {
    let connection;
    try {
        connection = await amqp.connect(process.env.RABBIT_MQ);
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: true });

        const routingKey = routingKeys[eventType] || 'defaultQueue';

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify({
            eventType,
            version: "1.0",
            producer: "api",
            timestamp: new Date(),
            correlationId: v4(),
            data,
        })));

        await channel.close();
    } catch (error) {
        throw new Error(`Error publishing message: ${error.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
