/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  mutation LoginClient($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      token\n      ok\n      error\n    }\n  }\n": types.LoginClientDocument,
};

export function graphql(source: "\n  mutation LoginClient($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      token\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation LoginClient($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      token\n      ok\n      error\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;