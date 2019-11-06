/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

/**
 * Wrapper around the bedrock-payment-http API.
 *
 * @param {object} [options] - Options to use.
 * @param {string} [options.baseURL = '/payment'] - The baseURL for
 *   the payment api.
 * @param {object} options.httpsAgent - The module used to
 *   fetch from the api.
 *
 * @returns {PaymentService} The PaymentService.
 */
export default class PaymentService {
  constructor({baseURL = '/payment', httpsAgent} = {}) {
    if(!httpsAgent) {
      throw new Error('PaymentService requires an httpsAgent.');
    }
    this.baseURL = baseURL;
    this.httpsAgent = httpsAgent;
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
    const {data} = await this.httpsAgent.get(this.baseURL, options);
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
    const {data} = await this.httpsAgent.get(url, options);
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
    const {data} = await this.httpsAgent.post(this.baseURL, {payment});
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
    const {data} = await this.httpsAgent.put(url, {order, payment});
    return data;
  }
}
