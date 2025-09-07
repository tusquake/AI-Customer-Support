import { GoogleGenerativeAI } from '@google/generative-ai';
import { handleMcp } from './mcpServer.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini client - correct way
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Ask Gemini to parse intent
async function detectIntent(userQuery) {
  const prompt = `
You are an advanced intent detection model for a customer service order assistant.
Extract the intent and parameters from the user query.
Return JSON ONLY in this format:
{
  "intent": "getOrderStatus" | "cancelOrder" | "updateAddress" | "trackLocation" | "scheduleRedelivery" | "getOrderHistory" | "other",
  "orderIds": ["<number1>", "<number2>", ...] or null,
  "orderId": "<single_order_number>" or null,
  "customerId": "<customer_id>" or null,
  "newAddress": "<address_string>" or null,
  "preferredDate": "<date_string>" or null,
  "reason": "<cancellation_reason>" or null
}

Intent Examples:
- "Order 5678 ka status batao" → {"intent": "getOrderStatus", "orderIds": ["5678"], "orderId": "5678"}
- "5678 aur 7181 order status check karo" → {"intent": "getOrderStatus", "orderIds": ["5678", "7181"]}
- "Cancel order 1234" → {"intent": "cancelOrder", "orderId": "1234"}
- "Cancel order 1234 wrong item received" → {"intent": "cancelOrder", "orderId": "1234", "reason": "wrong item received"}
- "Update address for order 5678 to new address xyz" → {"intent": "updateAddress", "orderId": "5678", "newAddress": "new address xyz"}
- "Where is my order 7181" → {"intent": "trackLocation", "orderId": "7181"}
- "Reschedule delivery for order 1234 to tomorrow" → {"intent": "scheduleRedelivery", "orderId": "1234", "preferredDate": "2025-09-08"}
- "mujhe CUST001 ka order history dikhao" → {"intent": "getOrderHistory", "customerId": "CUST001"}
- "Hello how are you" → {"intent": "other"}

Query: "${userQuery}"
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\s*/g, '').replace(/```\s*$/g, '');
    }
    
    return JSON.parse(cleanText.trim());
  } catch (err) {
    console.error('Gemini parse error:', err);
    return { intent: 'other', orderId: null, orderIds: null };
  }
}

export async function aiAgent(userQuery) {
  const q = String(userQuery || '').trim();
  if (!q) return 'Please enter a query.';

  const intentData = await detectIntent(q);
  const { intent, orderIds, orderId, customerId, newAddress, preferredDate, reason } = intentData;
  
  try {
    switch (intent) {
      case 'getOrderStatus':
        if (orderIds && orderIds.length > 0) {
          const results = [];
          for (const id of orderIds) {
            const result = await handleMcp('getOrderStatus', { orderId: id });
            if (result && result.status !== "Not Found") {
              results.push(` Order #${id}:\n   Status: ${result.status}\n   Expected Delivery: ${result.expectedDelivery}\n   Items: ${result.items?.join(', ') || 'N/A'}\n   Location: ${result.currentLocation || 'N/A'}`);
            } else {
              results.push(` Order #${id}: Not found`);
            }
          }
          return results.join('\n\n');
        } else if (orderId) {
          const result = await handleMcp('getOrderStatus', { orderId });
          if (!result || result.status === "Not Found") return `Order #${orderId} nahi mila.`;
          return `Order #${orderId} is ${result.status}  (Expected delivery: ${result.expectedDelivery})`;
        }
        break;

      case 'cancelOrder':
        if (orderId) {
          const result = await handleMcp('cancelOrder', { orderId, reason });
          if (result.error) {
            return ` ${result.error}`;
          }
          return ` ${result.message}${result.reason ? ` (Reason: ${result.reason})` : ''}`;
        }
        break;

      case 'updateAddress':
        if (orderId && newAddress) {
          const result = await handleMcp('updateOrderAddress', { orderId, newAddress });
          if (result.error) {
            return ` ${result.error}`;
          }
          return ` ${result.message}\n Old: ${result.oldAddress}\n  New: ${result.newAddress}`;
        }
        break;

      case 'trackLocation':
        if (orderId) {
          const result = await handleMcp('trackOrderLocation', { orderId });
          if (result.error) {
            return ` ${result.error}`;
          }
          return ` Order #${result.orderId} Tracking:\n   Tracking Number: ${result.trackingNumber}\n   Current Location: ${result.currentLocation}\n   Status: ${result.status}\n   Expected Delivery: ${result.estimatedDelivery}`;
        }
        break;

      case 'scheduleRedelivery':
        if (orderId && preferredDate) {
          const result = await handleMcp('scheduleRedelivery', { orderId, preferredDate });
          if (result.error) {
            return ` ${result.error}`;
          }
          return ` ${result.message}\n  New Delivery Date: ${result.newDeliveryDate}`;
        }
        break;

      case 'getOrderHistory':
        if (customerId) {
          const result = await handleMcp('getOrderHistory', { customerId });
          if (result.error) {
            return ` ${result.error}`;
          }
          
          let response = ` Order History for ${result.customerId} (${result.orderCount} orders):\n\n`;
          Object.keys(result.orders).forEach(orderId => {
            const order = result.orders[orderId];
            response += `Order #${orderId}: ${order.status} - ${order.items?.join(', ') || 'N/A'}\n`;
          });
          return response;
        }
        break;

      default:
        return " I can help you with:  Order Status: 'Order 5678 ka status batao' |  Cancel Orders: 'Cancel order 1234' |  Update Address |  Track Location |  Reschedule Delivery |  Order History. Please try one of these commands!";
    }
    
    return "Sorry, I couldn't process your request. Please provide the required information.";
    
  } catch (error) {
    console.error('AI Agent error:', error);
    return "Something went wrong. Please try again.";
  }
}