import React from "react";
import { Button } from "@material-ui/core";

export default function Login() {
  return (
    <div>
      <Button
        href="http://www.strava.com/oauth/authorize?client_id=41833&response_type=code&redirect_uri=http://localhost:3000/token&approval_prompt=force&scope=read,read_all,activity:read_all,profile:read_all"
        color="primary"
        variant="contained"
      >
        Sign In With Strava
      </Button>
    </div>
  );
}
