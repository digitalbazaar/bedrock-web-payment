/**!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

/**
 * Wrapper around the bedrock-payment-http API.
 *
 * @param {object} [options] - Options to use.
 * @param {string} [options.baseURL = '/payment'] - The baseURL for
 *   the payment api.
 *
 * @returns {PaymentService} The PaymentService.
 */
export default class PaymentService {
  constructor({baseURL = '/payment'} = {}) {
    this.baseURL = baseURL;
  }

  /**
   * Gets payments for an account.
   *
   * @param {object} options - Options to use.
   * @param {object} options.params - Query params for the request.
   *
   * @returns {Array<object>} All payments for an account.
   */
  async getPayments({params} = {}) {
    const options = {params};
    const {data} = await axios.get(this.baseURL, options);
    return data;
  }

  /**
   * Gets the meta-data necessary for a client side charge for a
   *   payment gateway.
   *
   * @returns {Promise<object>} The meta data for the Payment Button.
   */
  async getMeta({service = 'paypal'} = {}) {
    const url = `${this.baseURL}/credentials`;
    const options = {params: {service}};
    const {data} = await axios.get(url, options);
    return data;
  }

  /**
   * Creates an initial payment server side before the user
   * is charged.
   *
   * @param {object} options - Options to use.
   * @param {object} options.payment - Contains the payment service,
   *   amount, etc.
   *
   * @returns {Promise<object>} Returns a payment.
   */
  async createPayment({payment}) {
    const {data} = await axios.post(this.baseURL, {payment});
    return data;
  }

  /**
   * Processes a payment after the user's payment details
   * have been submitted to the payment Gateway.
   *
   * @param {object} options - Options to use.
   * @param {object} options.order - The order from the payment gateway.
   * @param {object} options.payment - The payment to process.
   *
   * @returns {Promise<object>} An object with the result of the payment.
   */
  async processPayment({order, payment}) {
    const url = `${this.baseURL}/${encodeURIComponent(payment.id)}`;
    const {data} = await axios.put(url, {order, payment});
    return data;
  }
}
