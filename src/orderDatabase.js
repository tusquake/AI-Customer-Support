const orders = {
  5678: { 
    status: "Shipped", 
    expectedDelivery: "2025-09-10", 
    customerId: "CUST001",
    address: "123 Main St, Mumbai, MH",
    items: ["Smartphone", "Case"],
    trackingNumber: "TN123456789",
    currentLocation: "Delhi Hub"
  },
  1234: { 
    status: "Delivered", 
    expectedDelivery: "2025-09-01", 
    customerId: "CUST002",
    address: "456 Park Ave, Delhi, DL",
    items: ["Laptop", "Mouse"],
    trackingNumber: "TN987654321",
    currentLocation: "Delivered"
  },
  9101: { 
    status: "Processing", 
    expectedDelivery: "2025-09-15", 
    customerId: "CUST003",
    address: "789 Garden St, Bangalore, KA",
    items: ["Headphones"],
    trackingNumber: "TN456789123",
    currentLocation: "Warehouse"
  },
  1121: { 
    status: "Cancelled", 
    expectedDelivery: "N/A", 
    customerId: "CUST004",
    address: "321 River Rd, Chennai, TN",
    items: ["Tablet"],
    trackingNumber: "TN789123456",
    currentLocation: "Cancelled",
    cancellationReason: "Customer Request"
  },
  3141: { 
    status: "Out for Delivery", 
    expectedDelivery: "2025-09-09", 
    customerId: "CUST005",
    address: "654 Hill St, Pune, MH",
    items: ["Watch", "Charger"],
    trackingNumber: "TN321654987",
    currentLocation: "Local Delivery Hub"
  },
  5161: { 
    status: "Returned", 
    expectedDelivery: "N/A", 
    customerId: "CUST001",
    address: "123 Main St, Mumbai, MH",
    items: ["Shoes"],
    trackingNumber: "TN147258369",
    currentLocation: "Return Center"
  },
  7181: { 
    status: "On Hold", 
    expectedDelivery: "N/A", 
    customerId: "CUST006",
    address: "987 Beach Rd, Goa, GA",
    items: ["Camera"],
    trackingNumber: "TN852963741",
    currentLocation: "Chennai Hub",
    holdReason: "Address Verification Pending"
  },
  9202: { 
    status: "In Transit", 
    expectedDelivery: "2025-09-12", 
    customerId: "CUST007",
    address: "159 Valley View, Hyderabad, TS",
    items: ["Books", "Bookshelf"],
    trackingNumber: "TN963741852",
    currentLocation: "Hyderabad Hub"
  },
  1222: { 
    status: "Awaiting Payment", 
    expectedDelivery: "N/A", 
    customerId: "CUST008",
    address: "753 Lake Side, Kolkata, WB",
    items: ["Gaming Console"],
    trackingNumber: "TN741852963",
    currentLocation: "Payment Hold"
  },
  3242: { 
    status: "Partially Shipped", 
    expectedDelivery: "2025-09-11", 
    customerId: "CUST009",
    address: "852 Mountain Top, Shimla, HP",
    items: ["Kitchen Set", "Utensils"],
    trackingNumber: "TN369258147",
    currentLocation: "Multiple Locations"
  },
  5262: { 
    status: "Ready for Pickup", 
    expectedDelivery: "2025-09-08", 
    customerId: "CUST010",
    address: "Pickup Center - Sector 14, Gurgaon",
    items: ["Furniture"],
    trackingNumber: "TN258147369",
    currentLocation: "Pickup Center"
  },
  7282: { 
    status: "Failed Delivery", 
    expectedDelivery: "N/A", 
    customerId: "CUST011",
    address: "147 Old Town, Jaipur, RJ",
    items: ["Clothing"],
    trackingNumber: "TN159753486",
    currentLocation: "Local Hub",
    failureReason: "Customer Not Available"
  },
  9303: { 
    status: "Delivered", 
    expectedDelivery: "2025-09-05", 
    customerId: "CUST012",
    address: "486 New Colony, Ahmedabad, GJ",
    items: ["Electronics"],
    trackingNumber: "TN753486159",
    currentLocation: "Delivered"
  },
  1323: { 
    status: "Shipped", 
    expectedDelivery: "2025-09-14", 
    customerId: "CUST013",
    address: "159 Tech Park, Bangalore, KA",
    items: ["Software"],
    trackingNumber: "TN486159753",
    currentLocation: "Bangalore Hub"
  },
  3343: { 
    status: "Processing", 
    expectedDelivery: "2025-09-16", 
    customerId: "CUST014",
    address: "753 Art District, Mumbai, MH",
    items: ["Art Supplies"],
    trackingNumber: "TN123789456",
    currentLocation: "Warehouse"
  },
  5363: { 
    status: "Cancelled", 
    expectedDelivery: "N/A", 
    customerId: "CUST015",
    address: "456 Sports Complex, Delhi, DL",
    items: ["Sports Equipment"],
    trackingNumber: "TN789456123",
    currentLocation: "Cancelled",
    cancellationReason: "Out of Stock"
  },
  7383: { 
    status: "Out for Delivery", 
    expectedDelivery: "2025-09-13", 
    customerId: "CUST016",
    address: "321 Green Valley, Pune, MH",
    items: ["Garden Tools"],
    trackingNumber: "TN456123789",
    currentLocation: "Local Delivery Hub"
  }
};

// Customer order history mapping
const customerOrders = {
  "CUST001": [5678, 5161],
  "CUST002": [1234],
  "CUST003": [9101],
  "CUST004": [1121],
  "CUST005": [3141],
  "CUST006": [7181],
  "CUST007": [9202],
  "CUST008": [1222],
  "CUST009": [3242],
  "CUST010": [5262],
  "CUST011": [7282],
  "CUST012": [9303],
  "CUST013": [1323],
  "CUST014": [3343],
  "CUST015": [5363],
  "CUST016": [7383]
};

export function getOrderStatus(orderId) {
  const order = orders[orderId];
  if (!order) return { status: "Not Found" };
  
  return {
      status: order.status,
      expectedDelivery: order.expectedDelivery,
      trackingNumber: order.trackingNumber,
      currentLocation: order.currentLocation,
      items: order.items
  };
}

export function cancelOrder(orderId, reason = "Customer Request") {
  const order = orders[orderId];
  if (!order) return { error: "Order not found" };
  
  if (["Delivered", "Cancelled", "Returned"].includes(order.status)) {
      return { error: `Cannot cancel order with status: ${order.status}` };
  }
  
  orders[orderId].status = "Cancelled";
  orders[orderId].cancellationReason = reason;
  orders[orderId].expectedDelivery = "N/A";
  
  return { success: true, message: `Order ${orderId} has been cancelled`, reason };
}

export function updateOrderAddress(orderId, newAddress) {
  const order = orders[orderId];
  if (!order) return { error: "Order not found" };
  
  if (["Delivered", "Cancelled", "Out for Delivery"].includes(order.status)) {
      return { error: `Cannot update address for order with status: ${order.status}` };
  }
  
  const oldAddress = order.address;
  orders[orderId].address = newAddress;
  
  return { 
      success: true, 
      message: `Address updated for order ${orderId}`,
      oldAddress,
      newAddress
  };
}

export function getOrdersByStatus(status) {
  const filteredOrders = {};
  Object.keys(orders).forEach(orderId => {
      if (orders[orderId].status === status) {
          filteredOrders[orderId] = orders[orderId];
      }
  });
  
  return {
      status,
      count: Object.keys(filteredOrders).length,
      orders: filteredOrders
  };
}

export function getOrderHistory(customerId) {
  const customerOrderIds = customerOrders[customerId];
  if (!customerOrderIds) {
      return { error: "Customer not found" };
  }
  
  const customerOrderDetails = {};
  customerOrderIds.forEach(orderId => {
      customerOrderDetails[orderId] = orders[orderId];
  });
  
  return {
      customerId,
      orderCount: customerOrderIds.length,
      orders: customerOrderDetails
  };
}

export function scheduleRedelivery(orderId, preferredDate) {
  const order = orders[orderId];
  if (!order) return { error: "Order not found" };
  
  if (order.status !== "Failed Delivery") {
      return { error: "Redelivery can only be scheduled for failed deliveries" };
  }
  
  orders[orderId].status = "Scheduled for Redelivery";
  orders[orderId].expectedDelivery = preferredDate;
  
  return {
      success: true,
      message: `Redelivery scheduled for order ${orderId}`,
      newDeliveryDate: preferredDate
  };
}

export function trackOrderLocation(orderId) {
  const order = orders[orderId];
  if (!order) return { error: "Order not found" };
  
  return {
      orderId,
      trackingNumber: order.trackingNumber,
      currentLocation: order.currentLocation,
      status: order.status,
      estimatedDelivery: order.expectedDelivery
  };
}

export function estimateDeliveryTime(orderId) {
  const order = orders[orderId];
  if (!order) return { error: "Order not found" };
  
  const currentDate = new Date();
  const deliveryDate = new Date(order.expectedDelivery);
  const timeDiff = deliveryDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  let estimation;
  if (daysDiff < 0) {
      estimation = "Overdue";
  } else if (daysDiff === 0) {
      estimation = "Today";
  } else if (daysDiff === 1) {
      estimation = "Tomorrow";
  } else {
      estimation = `${daysDiff} days`;
  }
  
  return {
      orderId,
      currentStatus: order.status,
      expectedDelivery: order.expectedDelivery,
      estimatedTime: estimation,
      daysRemaining: daysDiff > 0 ? daysDiff : 0
  };
}