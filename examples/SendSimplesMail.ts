import NeptuneMail from "../src/NeptuneMail";

const neptune = new NeptuneMail({
  host: '',
  authentication: {
    email: "",
    password: ""
  },
  sender_email: ""
});

neptune.sendMail(['mxtheuzchika@gmail.com'], "Hello, World!", "Hello, welcome to Neptune!")