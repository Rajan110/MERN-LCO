const stripe = require("stripe")(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require("uuid");
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.PP_MERCH_ID,
  publicKey: process.env.PP_PUB_KEY,
  privateKey: process.env.PP_PRIVATE_KEY,
});

exports.payViaStripe = (req, res) => {
  const { products, token } = req.body;
  console.log("Products Log : ", products);

  let total = 0;
  products &&
    products.forEach((product) => {
      total = product.price * product.count + total;
    });

  console.log("Total Amt : ", total);

  const idempotencyKey = uuidv4();

  // Create a new customer and then create an invoice item then invoice it:
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      // have access to the customer object
      stripe.charges
        .create(
          {
            amount: total * 100, //multiply with 100 as it deals in cents/paise
            currency: "INR",
            customer: customer.id, // set the customer id
            receipt_email: token.email,
            description: "Purchase Made On TeeStore",

            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          console.log("Ressssultttt : ", result);
          res.status(200).json(result);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log("Errrrrr : ", err));
};

exports.payViaPaypal = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        return res.json(result);
      }
    }
  );
};

exports.getPaypalToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.json(response);
    }
  });
};
