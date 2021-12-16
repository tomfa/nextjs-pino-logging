import Logger from "../../logger";
import handler from "../../middlewares/requestHandler";

type HelloResponse = { id: string, name: string }
const helloHandler = handler<HelloResponse>().get((req, res) => {
  // const user = createNewUser();
  const user = { id: "123", name: "John Doe " };
  Logger.info("Hi there", {
    action: "USER_LOGIN",
    domain: "AUTH",
    customerId: user.id,
  });

  res.status(200).json(user);
});

export default helloHandler;
