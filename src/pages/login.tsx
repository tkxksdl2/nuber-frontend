import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  LoginClientMutation,
  LoginClientMutationVariables,
} from "../gql/graphql";
import nuberLogo from "../images/nuber-logo.svg";

const LOGIN_MUTATION = gql`
  mutation LoginClient($loginInput: LoginInput!) {
    login(input: $loginInput) {
      token
      ok
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({ mode: "onBlur" });
  const onCompleted = (data: LoginClientMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutaion, { loading, error, data: loginMutationResult }] =
    useMutation<LoginClientMutation, LoginClientMutationVariables>(
      LOGIN_MUTATION,
      {
        variables: {
          loginInput: {
            email: watch("email"),
            password: watch("password"),
          },
        },
        onCompleted: onCompleted,
      }
    );
  const onSubmit = async () => {
    if (!loading) {
      await loginMutaion();
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-32 font-semibold">
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={nuberLogo} className="w-60 mb-10" alt="not found" />
        <h4 className="w-full text-3xl">Welcome Back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 mb-2 w-full "
        >
          <input
            {...register("email", { required: "Email is required" })}
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
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
          <Button canClick={isValid} loading={loading} actionText="Log In" />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to nuber?{" "}
          <Link to="/create-account" className=" text-lime-600 hover:underLine">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
