import NeptuneMail from "../dist/src/NeptuneMail";

const mailer = new NeptuneMail({
  config: "main"
})

mailer.sendMail(["example@gmail.com"], 'Hello, World!', 'Hellooooooooo')
