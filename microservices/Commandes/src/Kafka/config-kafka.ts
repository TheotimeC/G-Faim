import { Kafka, Producer, Consumer, EachMessagePayload } from "kafkajs";
import WebSocket, { WebSocketServer } from 'ws';

export class KafkaConfig {
  private static instance: KafkaConfig;
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private wss: WebSocketServer;

  private constructor() {
    this.kafka = new Kafka({
      clientId: "nodejs-kafka",
      brokers: ["localhost:9092"],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "Order" });
    // Initialize the WebSocket server on the appropriate port
    this.wss = new WebSocketServer({ port: 8080 });
  }

  public static getInstance(): KafkaConfig {
    if (!KafkaConfig.instance) {
      KafkaConfig.instance = new KafkaConfig();
    }
    return KafkaConfig.instance;
  }

  async produce(topic: string, messages: { key: string, value: string }[]): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages,
    });
    // Note: You might consider not disconnecting after each send in real-world applications
    // to improve performance, unless this behavior is specifically desired.
    await this.producer.disconnect();
  }

  async consumeAndBroadcast(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: 'Order', fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          let value = "";
          if (message.value) value = message.value.toString();

          // Broadcast to all connected WebSocket clients
          this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(value);
            }
          });
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  startWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket client connected');
      // No need to start a new consumer for each connection
      // The broadcast is handled by consumeAndBroadcast method
    });

    this.wss.on('listening', () => {
      const address = this.wss.address();
      console.log(`WebSocket server started on port ${typeof address === 'string' ? address : address.port}`);
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    // Start consuming messages from Kafka and broadcasting to WebSocket clients
    this.consumeAndBroadcast();
  }
}
