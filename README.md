
# Neptune
### <b>"Security, queues, simplicity"</b><br>
Neptune is an innovative project for sending email messages. It is capable of storing messages in what we call <b>"queues"</b>, so you can be sure that your emails will be sent. We noticed the security flaws in other mailers for JavaScript, and it was with that in mind that we created a <b>different style of authentication</b>. The project is fully developed with TypeScript, which provides full typing for your project, all for your code to be more cozy

## How to install 
Install Neptune is so easy! Just use:

#### Using NPM
```
npm i neptune-mail
```

#### Using Yarn
```
yarn neptune-mail
```

## How to use "config.nep" file
Neptune uses a security-focused configuration style. After installing the package, you need to create a file called config.nep at the root of your project (level where package.json is located) with the following content.

```
main {
  host: smtp.gmail.com
  port: 465
  secure_ssl: true
  auth {
    user: example@gmail.com
    password: env('PASSWORD_FROM_DOTENV')
  }
  sender {
    email: example@gmail.com
  }
}
```

### IMPORTANT
It is extremely important that you follow the same model as it was represented. For example, the "spaces" between the braces, in the case of env(), use single quotes etc... at the beginning of the file there is a "main", that means that the name of the configuration is "main" (this is changeable, as long as the name of the configuration is in all lowercase, without accents, without spaces and without special signs), this will be set in the code later.<br>
it's worth remembering that you can have several configurations, just re-copy the model and change its name.

## Sending emails
Sending emails with Netpune is simple, you just need to instantiate the NeptuneMail class passing an object with the "config" property as a parameter, which tells which configuration to use (configuration can be defined in the config.nep file). After that, you can use the sendMail method, passing an array of strings that are emails (recipients), the email title and the content in the body of the email.

```typescript
import NeptuneMail from "../dist/src/NeptuneMail";

const mailer = new NeptuneMail({
  // configFilePath: "/configuration/", This parameter is optional and is used in case you want to leave config.nep in another folder.
  config: "main" // "main" is the name of the configuration from config.nep file
})

mailer.sendMail(["example@gmail.com"], 'Hello, World!', 'Hellooooooooo')
```

<hr>

Could you follow me? ❤
