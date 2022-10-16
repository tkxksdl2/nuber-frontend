import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { LOCALSTORAGE_TOKEN } from "../constant";
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
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true);
    }
  };
  const [loginMutaion, { loading, data: loginMutationResult }] = useMutation<
    LoginClientMutation,
    LoginClientMutationVariables
  >(LOGIN_MUTATION, {
    variables: {
      loginInput: {
        email: watch("email"),
        password: watch("password"),
      },
    },
    onCompleted: onCompleted,
  });
  const onSubmit = async () => {
    if (!loading) {
      await loginMutaion();
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-32 font-semibold">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={nuberLogo} className="w-60 mb-10" alt="not found" />
        <h4 className="w-full text-3xl">Welcome Back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 mb-2 w-full "
        >
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
