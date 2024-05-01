import * as React from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export default function SimpleAlert({severity, message}) {
  return (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity={severity}>
{message}
    </Alert>
  );
}
