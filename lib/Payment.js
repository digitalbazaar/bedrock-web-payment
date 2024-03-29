/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

/**
 * Payment is class that tracks payments from various providers.
 * It can be used on the front and back end to ensure consistency.
 * If you post to a bedrock-payment-http route and don't use this class
 * it could be rejected as invalid.
 *
 * @param {object} options - Options to use.
 * @param {string} options.id - An id to use for the payment.
 * @param {string} options.amount - The amount of the payment.
 * @param {string} options.creator - The payee's account id.
 * @param {string} options.service - The payment service to use.
 * @param {string} [options.currency = 'USD'] - The currency of the payment.
 * @param {Array<string|object>} options.orders - The productIds of the products
 *   being purchased.
 * @param {string} [options.stats = 'PENDING'] - One several PaymentStatuses.
 * @param {string} [options.created = RFC3339 Date] - Date created.
 *
 * @returns {Payment} A payment class.
 */
export default class Payment {
  constructor({
    id, amount, creator, paymentService, paymentServiceId,
    orderId, orderService, currency = 'USD', status = 'PENDING',
    validated = false, created = new Date().toISOString(), error = null
  }) {
    this.id = id;
    this.amount = amount;
    this.currency = currency;
    this.creator = creator;
    this.validated = validated;
    this.paymentService = paymentService;
    this.paymentServiceId = paymentServiceId;
    this.status = status;
    this.error = error;
    this.orderId = orderId;
    this.created = created;
    this.orderService = orderService;
  }
}
