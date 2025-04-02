import amqp from 'amqplib';

const exchange = 'processTaskExchange';
const routingKey = 'task';

export default async (message) => {
    let connection;
    try {
        connection = await amqp.connect(process.env.RABBIT_MQ);
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: true });

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });

        await channel.close();
    } catch (error) {
        throw new Error(`Error publishing message: ${error.message}`);
    }finally {
        if (connection) {
            await connection.close();
        }
    }
}