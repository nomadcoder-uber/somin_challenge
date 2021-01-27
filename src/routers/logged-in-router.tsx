import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => (
    <div>
      <h1>Hi Welcome!!!</h1>
      <button onClick={() => isLoggedInVar(false)}>Log Out</button>
    </div>
  );