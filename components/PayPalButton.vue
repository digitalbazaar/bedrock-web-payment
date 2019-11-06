<template>
  <div>
    <q-spinner
      v-if="loading" />
    <q-banner
      v-if="error"
      class="text-white bg-red">
      We are terribly sorry, but PayPal is not available
      at this time.
    </q-banner>
    <div
      id="paypal-button" />
  </div>
</template>

<script>
/*!
 * Copyright (c) 2018-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

/**
 * PayPalButton.vue is a simple wrapper around paypal's smart buttons.
 * You can login into https://www.sandbox.paypal.com with your sandbox
 * account to see the transactions in development mode.
 */
export default {
  name: 'PayPalButton',
  props: {
    // paypal clientId
    clientId: {
      type: String,
      required: true
    },
    // This determines if we are making a one time charge
    // or a recurring subscription charge.
    subscription: {
      type: Boolean,
      default: false
    },
    // This is a function passed in from the payment form
    // that determines how much the customer is charged.
    // @see https://developer.paypal.com/docs/api/orders/v2/
    // @see https://developer.paypal.com/docs/api/subscriptions/v1/
    // orders and subscriptions use different api endpoints.
    makeOrder: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      error: null
    };
  },
  mounted() {
    // if the paypal script has not been inserted
    // insert it
    if(!window.paypal) {
      return this.insertScript();
    }
    // if we already have the paypal script just insert the button
    this.insertButton();
  },
  methods: {
    // this fires after the PayPal script loads.
    handleLoad() {
      this.loading = false;
      this.insertButton();
    },
    // this fires if the PayPal script fails to load.
    handleError() {
      this.loading = false;
      this.error = true;
    },
    /**
     * This fires after the customer card is approved.
     * It makes one additional api call which contains
     * the completed order information.
     *
     * @param {object} data - Order data.
     * @param {object} actions - An actions object.
     *
     * @returns {undefined} Just emits the approved event.
     */
    async onApprove(data, actions) {
      const order = await actions.order.capture();
      this.$emit('approved', {data, order, actions});
    },
    /**
     * The paypal onError callback appears to only be called
     * when their sdk fails. Invalid card errors are not emitted.
     *
     * @param {object} e - An error.
     *
     * @returns {undefined} This function just emits an event.
     */
    onError(e) {
      console.error('PayPal Error', e);
      this.$emit('error', e);
    },
    /**
     * This callback receives the canceled order object, and an
     * actions object with a redirect function.
     *
     * @param {object} order - An order object with the orderID.
     * @param {object} actions - An actions object with a redirect.
     *
     * @returns {undefined} This function just emits an event.
     */
    onCancel(order, actions) {
      this.$emit('canceled', {order, actions});
    },
    payment(...args) {
      this.$emit('payment', args);
    },
    /**
     * This fires after the customer enters their address.
     * This provides a lot of good debugging information
     * including the amount charged before making the purchase.
     *
     * @param {object} data - Order data including orderID, paymentToken, etc.
     * @param {object} order - An order object.
     *
     * @returns {undefined} Just emits the shipping-changed event.
     */
    onShippingChange(data, order) {
      this.$emit('shipping-changed', {data, order});
    },
    insertButton() {
      const {paypal} = window;
      const options = {
        onApprove: this.onApprove,
        onCancel: this.onCancel,
        onError: this.onError,
        payment: this.payment,
        onShippingChange: this.onShippingChange
      };
      if(!this.subscription) {
        options.createOrder = this.makeOrder;
      }
      if(this.subscription) {
        options.createSubscription = this.makeOrder;
      }
      paypal.Buttons(options).render('#paypal-button');
    },
    insertScript() {
      const {clientId} = this;
      if(!clientId) {
        throw new Error('PayPal button requires a clientId');
      }
      this.error = null;
      this.loading = true;
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?' +
        `client-id=${encodeURIComponent(clientId)}`;
      script.async = true;
      script.addEventListener('load', this.handleLoad);
      script.addEventListener('error', this.handleError);
      document.body.appendChild(script);
    }
  }
};

</script>

<style scoped>
</style>
