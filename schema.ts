/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/register": {
    post: operations["register"];
  };
  "/login": {
    post: operations["login"];
  };
  "/musicians": {
    get: operations["getMusicians"];
  };
  "/musician/{musicianId}": {
    patch: operations["patchMusician"];
  };
  "/instruments": {
    get: operations["getInstruments"];
  };
  "/genres": {
    /** Get a list of all genres */
    get: operations["getGenres"];
  };
}

export interface components {
  schemas: {
    musician: {
      id?: string;
      email: string;
      givenName?: string;
      familyName?: string;
      phone?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      instagramUrl?: string;
      promotion?: "L1" | "L2" | "L3" | "M1" | "M2";
      location?: "Douai" | "Lille";
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
      token: string;
      refresh_token: string;
    };
  };
}

export interface operations {
  register: {
    responses: {
      /** The user has been registered in the db */
      201: {
        content: {
          "application/json": {
            token?: components["schemas"]["token"];
            musician?: components["schemas"]["musician"];
            genres?: components["schemas"]["genre"][];
            instruments?: components["schemas"]["instrument"][];
          };
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          musician: components["schemas"]["musician"];
          password: string;
          genres: components["schemas"]["genre"][];
          instruments: components["schemas"]["instrument"][];
        };
      };
    };
  };
  login: {
    responses: {
      /** Login successful */
      200: {
        content: {
          "application/json": components["schemas"]["token"] &
            components["schemas"]["musician"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          email?: string;
          password?: string;
        };
      };
    };
  };
  getMusicians: {
    responses: {
      /** A list of all the musicians */
      200: {
        content: {
          "application/json": components["schemas"]["musician"][];
        };
      };
    };
  };
  patchMusician: {
    parameters: {
      path: {
        musicianId?: unknown;
      };
    };
    responses: {
      /** The musician information has been updated */
      201: unknown;
    };
    requestBody: {
      content: {
        "application/json": {
          email?: string;
          givenName?: string;
          familyName?: string;
          phone?: string;
          facebookUrl?: string;
          twitterUrl?: string;
          instagramUrl?: string;
          promotion?: "L1" | "L2" | "L3" | "M1" | "M2";
          location?: "Douai" | "Lille";
        };
      };
    };
  };
  getInstruments: {
    responses: {
      /** A list of all the instruments */
      200: {
        content: {
          "application/json": components["schemas"]["instrument"][];
        };
      };
    };
  };
  /** Get a list of all genres */
  getGenres: {
    responses: {
      /** A list of all genres */
      200: {
        content: {
          "application/json": components["schemas"]["genre"][];
        };
      };
    };
  };
}

export interface external {}
