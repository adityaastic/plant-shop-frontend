const createPaymentLink = async (orderId) => {
  try {
    const order = await orderService.findOrderById(orderId);

    const paymentLinkRequest = {
      amount: order.totalPrice * 100,  // Razorpay expects the amount in paise (1 INR = 100 paise)
      currency: 'INR',
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        contact: order.user.mobile,
        email: order.user.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `https://plant-shop-rho.vercel.app/payment/${orderId}`,
      callback_method: 'get',
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    return {
      paymentLinkId: paymentLink.id,
      payment_link_url: paymentLink.short_url,
    };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw new Error(error.message);
  }
};
