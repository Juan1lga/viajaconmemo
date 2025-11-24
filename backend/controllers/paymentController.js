let conekta = null;
try {
  conekta = require('conekta');
  conekta.locale = 'es';
  conekta.api_version = '2.0.0';
} catch (e) {
  console.warn('Conekta SDK no está instalado, usando modo prueba.');
}
const Order = require('../models/Order');

exports.checkout = async (req, res) => {
  try {
    const { amount, packageId, email, name } = req.body;

    const isConektaSecretMissing = !process.env.CONEKTA_SECRET || process.env.CONEKTA_SECRET === 'tu_clave_secreta_conekta';

    if (isConektaSecretMissing || !conekta) {
      let msg = '';
      if (isConektaSecretMissing) {
        msg += 'La clave secreta de Conekta (CONEKTA_SECRET) no está configurada o sigue siendo el valor predeterminado. ';
      }
      if (!conekta) {
        msg += 'La librería de Conekta no está instalada. ';
      }
      msg += 'Respondiendo en modo de prueba.';

      return res.status(200).json({
        success: true,
        mock: true,
        msg,
        order: {
          packageId: packageId || null,
          amount: Number(amount),
          currency: 'MXN',
          status: 'pending',
          transactionId: 'mock_conekta_order_id',
          customerEmail: email
        },
        conektaOrder: { id: 'mock_conekta_order_id' },
        oxxo: { reference: '000000000000', barcode_url: null, expires_at: null }
      });
    }

    conekta.api_key = process.env.CONEKTA_SECRET;

    if (!amount || !email) {
      return res.status(400).json({ msg: 'Faltan campos requeridos: amount y email' });
    }

    const orderData = {
      currency: 'MXN',
      customer_info: {
        name: name || 'Cliente',
        email,
      },
      line_items: [
        {
          name: 'Paquete de Viaja con Memo',
          unit_price: Math.round(Number(amount) * 100),
          quantity: 1,
        },
      ],
      charges: [
        {
          payment_method: { type: 'oxxo_cash' },
        },
      ],
    };

    const conektaOrder = await conekta.Order.create(orderData);

    const charge = conektaOrder?.charges?.data?.[0] || null;
    const pm = charge ? charge.payment_method : null;

    const order = await Order.create({
      packageId: packageId || null,
      amount: Number(amount),
      currency: 'MXN',
      status: 'pending',
      transactionId: conektaOrder.id,
      customerEmail: email,
    });

    return res.json({
      success: true,
      order,
      conektaOrder,
      oxxo: pm
        ? {
            reference: pm.reference,
            barcode_url: pm.barcode_url,
            expires_at: pm.expires_at,
          }
        : null,
    });
  } catch (err) {
    console.error('Error del servidor en checkout:', err);
    const status = err?.details?.[0]?.type === 'parameter_validation_error' ? 400 : 500;
    res.status(status).json({ msg: 'Error al iniciar el pago', error: err });
  }
};

exports.webhook = async (req, res) => {
  try {
    const event = req.body;

    if (event && event.type === 'order.paid') {
      const orderId = event?.data?.object?.id;
      if (orderId) {
        await Order.findOneAndUpdate({ transactionId: orderId }, { status: 'paid' });
      }
    } else if (event && event.type === 'charge.refunded') {
      const orderId = event?.data?.object?.order_id;
      if (orderId) {
        await Order.findOneAndUpdate({ transactionId: orderId }, { status: 'refunded' });
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error del servidor en webhook:', err);
    res.status(500).json({ msg: 'Error en webhook' });
  }
};