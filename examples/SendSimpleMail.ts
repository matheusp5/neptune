import NeptuneMail from "../src/index";

const mailer = new NeptuneMail({
  config: "main"
})

mailer.sendMail(["example@gmail.com"], 'Hello, World!', 'Hellooooooooo')
