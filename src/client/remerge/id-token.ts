/*
 * Copyright 2017-2019 Allegro.pl
 * Copyright 2020 Remerge GmbH
 */
import * as Cookie from "js-cookie";

const ID_TOKEN_COOKIE_NAME = "id_token";

interface IdTokenUserAdminAttributes {
  admin: true;
  name: string;
  employee_type: string;
  employee_region: string;
}

interface IdTokenUserClientAttributes {
  admin: false;
}

type IdTokenUser = {
  id: number;
  email: string;
  organizations: number[];
} & (IdTokenUserAdminAttributes | IdTokenUserClientAttributes);

export interface IdToken {
  exp: number;
  user: IdTokenUser;
  csrf_token: string;
}

export function parseIdToken(): IdToken | undefined {
  const jwt = Cookie.get(ID_TOKEN_COOKIE_NAME);

  if (!jwt) return undefined;

  const [, body] = jwt.split(".");

  try {
    return JSON.parse(atob(body)) as IdToken;
  } catch (error) {
    console.error("Error decoding IdToken:", error);
    return undefined;
  }
}

export function removeIdToken() {
  Cookie.remove(ID_TOKEN_COOKIE_NAME, { path: "/", domain: process.env.REACT_APP_SSO_COOKIE_DOMAIN });
}
