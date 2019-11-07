/**!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import axios from 'axios';

/**
 * Wrapper around the bedrock-payment-http API.
 *
 * @param {object} [options] - Options to use.
 * @param {object} [options.urls={}] - Expandable url options.
 * @param {string} [options.urls.base='/payment'] - The baseUrl for
 *   the payment api.
 *
 * @returns {PaymentService} The PaymentService.
 */
export default class PaymentService {
  constructor({urls = {base: '/payment'}} = {}) {
    this.config = {urls};
  }

  /**
   * Gets payments for an account.
   *
   * @param {object} options - Options to use.
   * @param {object} options.params - Query params for the request.
   *
   * @returns {Array<object>} All payments for an account.
   */
  async getPayments({params, baseUrl = this.config.urls.base} = {}) {
    const options = {params};
    const {data} = await axios.get(baseUrl, options);
    return data;
  }

  /**
   * Gets the credentials necessary for a client side charge for a
   *   payment gateway.
   *
   * @returns {Promise<object>} The credentials for the Payment Button.
   */
  async getCredentials({
    service = 'paypal',
    baseUrl = this.config.urls.base} = {}) {
    const url = `${baseUrl}/credentials`;
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
  async createPayment({payment, baseUrl = this.config.urls.base}) {
    const {data} = await axios.post(baseUrl, {payment});
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
  async processPayment({order, payment, baseUrl = this.config.urls.base}) {
    const url = `${baseUrl}/${encodeURIComponent(payment.id)}`;
    const {data} = await axios.put(url, {order, payment});
    return data;
  }
}
