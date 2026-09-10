export const orderShippedEmail = (reference: string) => `
  <h2>Your order has been shipped 🚚</h2>

  <p>Good news! Your order has been shipped and now ready for pickup</p>

  <p>
    <strong>Order Reference:</strong> ${reference}
  </p>

  <p>You can pick it up within 5 business days.</p>

  <p>Thank you for shopping with us.</p>
`;

export const orderDeliveredEmail = (reference: string) => `
  <h2>Your order has been delivered 🎉</h2>

  <p>Your order has been successfully delivered.</p>

  <p>
    <strong>Order Reference:</strong> ${reference}
  </p>

  <p>Thank you for shopping with us.</p>
`;

export const orderRefundedEmail = (
  reference: string,
  note?: string
) => `
  <h2>Your order has been refunded</h2>

  <p>Your order has been refunded successfully.</p>

  <p>
    <strong>Order Reference:</strong> ${reference}
  </p>

  ${
    note
      ? `<p><strong>Refund Note:</strong> ${note}</p>`
      : ""
  }

  <p>If you have any questions, please contact our support team.</p>
`;