import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../gql/graphql";
import { useMe } from "../../hooks/useMe";

const VERIFIY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const navigate = useNavigate();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me) {
      client.writeFragment({
        id: `User:${userData?.me.id}` + "",
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      navigate("/", { replace: true });
    }
  };
  const [verifyEmail, { loading: verifyingEmail }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFIY_EMAIL_MUTATION, { onCompleted });

  const location = useLocation();
  useEffect(() => {
    const code = location.search.replace("?code=", "");
    verifyEmail({
      variables: { input: { code } },
      onCompleted,
    });
  }, []);

  return (
    <div className=" h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>VerifiEmail | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-2 font-semibold">Confirming email...</h2>
      <h4 className=" text-gray-700">Please wait, don't close this page</h4>
    </div>
  );
};
