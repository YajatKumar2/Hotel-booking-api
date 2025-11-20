/**
 * Simulates a call to a payment gateway (like Stripe).
 * Returns true if payment succeeds, false if it fails.
 */
export const processPayment = async (
  amount: number,
  cardNumber: string
): Promise<boolean> => {
  console.log(`Processing payment of $${amount} with card ending in ${cardNumber.slice(-4)}...`);

  // Simulate network delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate simple validation: If card number is "0000", fail. Otherwise, pass.
  if (cardNumber === '0000') {
    return false;
  }

  return true;
};