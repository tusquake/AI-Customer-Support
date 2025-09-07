// MCP server = standardized wrapper around tools/APIs
import { 
  getOrderStatus, 
  cancelOrder, 
  updateOrderAddress, 
  getOrdersByStatus,
  getOrderHistory,
  scheduleRedelivery,
  trackOrderLocation,
  estimateDeliveryTime
} from "./orderDatabase.js";

/**
 * handleMcp(command, params)
 * - command: string like "getOrderStatus", "cancelOrder", etc.
 * - params: object containing needed args
 */
export async function handleMcp(command, params) {
  switch (command) {
    case "getOrderStatus":
      return getOrderStatus(params.orderId);
      
    case "cancelOrder":
      return cancelOrder(params.orderId, params.reason);
      
    case "updateOrderAddress":
      return updateOrderAddress(params.orderId, params.newAddress);
      
    case "getOrdersByStatus":
      return getOrdersByStatus(params.status);
      
    case "getOrderHistory":
      return getOrderHistory(params.customerId);
      
    case "scheduleRedelivery":
      return scheduleRedelivery(params.orderId, params.preferredDate);
      
    case "trackOrderLocation":
      return trackOrderLocation(params.orderId);
      
    case "estimateDeliveryTime":
      return estimateDeliveryTime(params.orderId);
      
    case "getMultipleOrderStatus":
      // Handle multiple order IDs at once
      if (!params.orderIds || !Array.isArray(params.orderIds)) {
        return { error: "Invalid orderIds parameter" };
      }
      const results = {};
      params.orderIds.forEach(orderId => {
        results[orderId] = getOrderStatus(orderId);
      });
      return results;
      
    default:
      return { error: `Unknown command: ${command}` };
  }
}