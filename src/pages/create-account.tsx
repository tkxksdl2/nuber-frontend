import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from "../gql/graphql";
import nuberLogo from "../images/nuber-logo.svg";

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ICreateAccountForm>({
    mode: "onBlur",
    defaultValues: { role: UserRole.Client },
  });

  const navigate = useNavigate();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Account Created! Log in now!");
      navigate("/", { replace: true });
    }
  };

  const [createAccountMuation, { data: createAccountMutationResult, loading }] =
    useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
      CREATE_ACCOUNT_MUTATION,
      {
        variables: {
          createAccountInput: {
            email: watch("email"),
            password: watch("password"),
            role: watch("role"),
          },
        },
        onCompleted,
      }
    );

  const onSubmit = async () => {
    if (!loading) {
      await createAccountMuation();
    }
  };

  return (
    <div className="flex-container">
      <Helmet>
        <title>CreateAccount | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={nuberLogo} className="w-60 mb-10" alt="not found" />
        <h4 className="w-full text-3xl">Lets' get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid-form">
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid Email"} />
          )}
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password length must be more than 4",
              },
            })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className="input"
          />
          {errors.password?.type === "required" && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={isValid}
            loading={loading}
            actionText="Create Account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult?.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/" className=" text-lime-600 hover:underLine">
            Log in Now
          </Link>
        </div>
      </div>
    </div>
  );
};
