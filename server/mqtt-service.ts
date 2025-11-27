import { mqtt, iot } from "aws-iot-device-sdk-v2";
import { storage } from "./storage";
import { WebSocket } from "ws";

export class MqttService {
  private connection: mqtt.MqttClientConnection | null = null;
  private wsClients: Set<WebSocket> = new Set();
  private isConnected: boolean = false;

  constructor() {}

  async connect(endpoint: string, certPath: string, keyPath: string, caPath: string, clientId: string) {
    try {
      console.log("[MQTT] Connecting to AWS IoT Core...");
      
      const config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder(
        certPath,
        keyPath
      )
        .with_certificate_authority_from_path(undefined, caPath)
        .with_clean_session(true)
        .with_client_id(clientId)
        .with_endpoint(endpoint)
        .build();

      const client = new mqtt.MqttClient();
      this.connection = client.new_connection(config);

      this.connection.on('connect', () => {
        console.log("[MQTT] Connected to AWS IoT Core");
        this.isConnected = true;
        this.broadcastStatus({ type: 'mqtt_status', connected: true });
      });

      this.connection.on('disconnect', () => {
        console.log("[MQTT] Disconnected from AWS IoT Core");
        this.isConnected = false;
        this.broadcastStatus({ type: 'mqtt_status', connected: false });
      });

      this.connection.on('error', (error) => {
        console.error("[MQTT] Connection error:", error);
        this.isConnected = false;
      });

      await this.connection.connect();
      
      return true;
    } catch (error) {
      console.error("[MQTT] Failed to connect:", error);
      this.isConnected = false;
      return false;
    }
  }

  async subscribe(topic: string) {
    if (!this.connection) {
      console.error("[MQTT] Not connected. Cannot subscribe to topic:", topic);
      return;
    }

    try {
      console.log(`[MQTT] Subscribing to topic: ${topic}`);
      await this.connection.subscribe(
        topic,
        mqtt.QoS.AtLeastOnce,
        async (topic, payload) => {
          try {
            const message = JSON.parse(new TextDecoder().decode(payload));
            console.log(`[MQTT] Received message on ${topic}:`, message);
            
            await this.handleIncomingMessage(topic, message);
          } catch (error) {
            console.error("[MQTT] Error processing message:", error);
          }
        }
      );
      console.log(`[MQTT] Successfully subscribed to: ${topic}`);
    } catch (error) {
      console.error(`[MQTT] Failed to subscribe to ${topic}:`, error);
    }
  }

  private async handleIncomingMessage(topic: string, message: any) {
    // Extract device identifier from topic or message
    const thingName = message.thingName || this.extractThingNameFromTopic(topic);
    
    if (!thingName) {
      console.warn("[MQTT] No thing name found in message or topic");
      return;
    }

    // Find device by AWS Thing Name
    const device = await storage.getDeviceByAwsThingName(thingName);
    
    if (!device) {
      console.warn(`[MQTT] Device not found for thing name: ${thingName}`);
      return;
    }

    // Update device with sensor data
    const updates: any = {};
    
    if (message.batteryLevel !== undefined) updates.batteryLevel = message.batteryLevel;
    if (message.pressureLevel !== undefined) updates.pressureLevel = message.pressureLevel;
    if (message.co2Level !== undefined) updates.co2Level = message.co2Level;
    if (message.particulateMatter !== undefined) updates.particulateMatter = message.particulateMatter;
    if (message.windSpeed !== undefined) updates.windSpeed = message.windSpeed;
    if (message.windDirection !== undefined) updates.windDirection = message.windDirection;
    if (message.status !== undefined) updates.status = message.status;
    if (message.fireStatus !== undefined) updates.fireStatus = message.fireStatus;

    if (Object.keys(updates).length > 0) {
      const updatedDevice = await storage.updateDevice(device.id, updates);
      
      // Broadcast to all WebSocket clients
      this.broadcast({
        type: 'device_update',
        device: updatedDevice
      });

      // Create notification if needed
      if (message.status === 'emergency' || message.status === 'warning') {
        await storage.createNotification({
          type: message.status,
          title: `${message.status === 'emergency' ? 'EMERGENCY' : 'Warning'} Alert`,
          message: `${device.name} reported ${message.status} status`,
          deviceId: device.id,
          read: false
        });
      }
    }
  }

  private extractThingNameFromTopic(topic: string): string | null {
    // Assuming topic format like: sensors/{thingName}/data
    const match = topic.match(/sensors\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  async publish(topic: string, message: any) {
    if (!this.connection) {
      console.error("[MQTT] Not connected. Cannot publish to topic:", topic);
      return;
    }

    try {
      await this.connection.publish(
        topic,
        JSON.stringify(message),
        mqtt.QoS.AtLeastOnce
      );
      console.log(`[MQTT] Published to ${topic}:`, message);
    } catch (error) {
      console.error(`[MQTT] Failed to publish to ${topic}:`, error);
    }
  }

  addWebSocketClient(ws: WebSocket) {
    this.wsClients.add(ws);
    console.log(`[WS] Client connected. Total clients: ${this.wsClients.size}`);
    
    // Send current status
    ws.send(JSON.stringify({ type: 'mqtt_status', connected: this.isConnected }));
  }

  removeWebSocketClient(ws: WebSocket) {
    this.wsClients.delete(ws);
    console.log(`[WS] Client disconnected. Total clients: ${this.wsClients.size}`);
  }

  private broadcast(data: any) {
    const message = JSON.stringify(data);
    this.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private broadcastStatus(data: any) {
    this.broadcast(data);
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
      this.isConnected = false;
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      clientsConnected: this.wsClients.size
    };
  }
}

export const mqttService = new MqttService();
