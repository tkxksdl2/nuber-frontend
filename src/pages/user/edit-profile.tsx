import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../gql/graphql";
import { useMe } from "../../hooks/useMe";

const EDIT_PROFILE_MUTAION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const client = useApolloClient();
  const { data: userData } = useMe();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}` + "",
          fragment: gql`
            fragment EditUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTAION, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<IFormProps>({
    mode: "onBlur",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          ...(email === "" ? { email: userData?.me.email } : { email }),
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-bold text-xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 max-w-screen-sm mt-5 mb-2 w-full "
      >
        <input
          {...register("email", {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          type="email"
          placeholder="Email"
        />
        {errors.email?.type === "pattern" && (
          <FormError errorMessage={"Please enter a valid Email"} />
        )}
        <input
          {...register("password", {
            minLength: {
              value: 4,
              message: "Password length must be more than 4",
            },
          })}
          className="input"
          type="password"
          placeholder="password"
        />
        {errors.password?.type === "minLength" && (
          <FormError errorMessage={errors.password?.message} />
        )}
        <Button
          canClick={isValid}
          loading={loading}
          actionText="Update Profile"
        />
      </form>
    </div>
  );
};
