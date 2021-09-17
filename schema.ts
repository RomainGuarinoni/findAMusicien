/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {}

export interface components {
  schemas: {
    musician: {
      id: string;
      email: string;
      givenName?: string;
      familyName?: string;
      phone?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      instagramUrl?: string;
      promotion?: "L1" | "L2" | "L3" | "M1" | "M2";
      location?: "Douai" | "Lille";
      instruments?: components["schemas"]["instrument"][];
    };
    instrument: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface operations {}

export interface external {}
