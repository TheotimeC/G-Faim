import { Kafka, Producer, Consumer, EachMessagePayload } from "kafkajs";
import WebSocket, { WebSocketServer } from 'ws'; // Importation avec les types

export class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private wss: WebSocketServer; // Typage du serveur WebSocket

  constructor() {
    this.kafka = new Kafka({
      clientId: "nodejs-kafka",
      brokers: ["localhost:9092"],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "Order" });
    this.wss = new WebSocketServer({ port: 8081 }); // Initialisation du serveur WebSocket sur le port 8080
  }

  async produce(topic: string, messages: { value: string }[]): Promise<void> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic,
        messages,
      });
    } catch (error) {
      console.error(error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic: string, callback: (value: string) => void): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          let value = "";
          if (message.value) value = message.value.toString();
          callback(value);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  startWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Nouveau client WebSocket connecté');

      const kafkaMessageCallback = (message: string) => {
        ws.send(message);
      };

      // Vous pouvez remplacer 'your_kafka_topic' par le nom de votre topic Kafka réel
      this.consume('Order', kafkaMessageCallback);
    });
    this.wss.on('error', (error) => {
      console.error('Erreur du serveur WebSocket:', error);
    });
    

    console.log('Serveur WebSocket démarré sur le port 8080');
  }
}
