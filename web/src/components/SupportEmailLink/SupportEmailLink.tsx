import * as React from "react";
import { Link } from "../Link/Link";

type Props =
  | {
      subject: string;
      body: string;
    }
  | {};

export function SupportEmailLink(props: Props) {
  const email = "supporto@trovamascherine.org";
  const href =
    "subject" in props
      ? `mailto:${email}?subject=${props.subject}&body=${props.body}`
      : `mailto:${email}`;
  return <Link href={href}>supporto@trovamascherine.org</Link>;
}
