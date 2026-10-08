async function getBalanceTransaction(stripe, value) {
  if (!value) return null;
  return typeof value === 'string' ? stripe.balanceTransactions.retrieve(value) : value;
}

async function computeStripeFinancials(stripe, source) {
  let charge = source?.object === 'charge' ? source : null;
  let paymentIntent = source?.object === 'payment_intent' ? source : source?.payment_intent;

  if (!charge && typeof paymentIntent === 'string') {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent, {
      expand: ['latest_charge.balance_transaction'],
    });
  }

  if (!charge && paymentIntent?.latest_charge) {
    charge = typeof paymentIntent.latest_charge === 'string'
      ? await stripe.charges.retrieve(paymentIntent.latest_charge, { expand: ['balance_transaction'] })
      : paymentIntent.latest_charge;
  }

  if (!charge?.id) return null;
  if (!charge.balance_transaction) {
    charge = await stripe.charges.retrieve(charge.id, { expand: ['balance_transaction'] });
  }

  const chargeTransaction = await getBalanceTransaction(stripe, charge.balance_transaction);
  if (!chargeTransaction) return null;

  let feeCents = Number(chargeTransaction.fee || 0);
  let netCents = Number(chargeTransaction.net || 0);

  const refunds = stripe.refunds.list({
    charge: charge.id,
    limit: 100,
    expand: ['data.balance_transaction'],
  });
  for await (const refund of refunds) {
    if (refund.status !== 'succeeded' || !refund.balance_transaction) continue;
    const transaction = await getBalanceTransaction(stripe, refund.balance_transaction);
    if (!transaction) continue;
    feeCents += Number(transaction.fee || 0);
    netCents += Number(transaction.net || 0);
  }

  return {
    stripe_fee_amount: Number((feeCents / 100).toFixed(2)),
    stripe_net_amount: Number((netCents / 100).toFixed(2)),
    stripe_balance_currency: String(chargeTransaction.currency || 'brl').toLowerCase(),
    stripe_financials_synced_at: new Date().toISOString(),
  };
}

module.exports = { computeStripeFinancials };
