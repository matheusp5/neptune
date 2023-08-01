import NeptuneMail from "../src/NeptuneMail";

const mailer = new NeptuneMail({
  config: "main"
})

mailer.sendMail(["mxtheuzchika@gmail.com"], 'Hello, World!', 'Hellooooooooo')
