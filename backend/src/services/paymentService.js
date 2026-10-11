export class PaymentService {
  async processPayment(orderDetails) {
    throw new Error('processPayment method must be implemented by payment provider.');
  }
}

export class MockPaymentService extends PaymentService {
  async processPayment({ orderId, amount, paymentMethod = 'MOCK_CARD' }) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const transactionId = 'TXN-' + Math.floor(100000000 + Math.random() * 900000000);

    return {
      success: true,
      transactionId,
      status: 'PAID',
      paymentMethod,
      amount,
      message: 'Mock payment processed successfully for MediBridge Pharmacy purchase.',
    };
  }
}

export const paymentProvider = new MockPaymentService();
