import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Helmet from 'react-helmet';
import { authTokenVar, isLoggedInVar } from "../apollo";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { login, loginVariables } from "../__generated__/login";
import { LS_TOKEN } from "../constants";
import React from "react";
import { Link } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, handleSubmit, getValues, errors, formState } = useForm<
    ILoginForm
  >({ mode: "onChange" });
  const onCompleted = (data: login) => {
    const {
      login: { ok, token }
    } = data;
    if (ok && token) {
      localStorage.setItem(LS_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };
  const [login, { data: loginResults, loading }] = useMutation<
    login,
    loginVariables
  >(LOGIN_MUTATION, {
    onCompleted
  });
  const onValid = () => {
    const { email, password } = getValues();
    login({
      variables: {
        input: {
          email,
          password
        }
      }
    });
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Helmet>
        <title>Login | Podcast</title>
      </Helmet>
      <h2 className="text-3xl mb-9">Welcome</h2>
      <form
        className="grid gap-3 w-full max-w-xs"
        onSubmit={handleSubmit(onValid)}
      >
        <input
          className="border border-gray-300 focus:outline-none px-5 py-3 focus:border-gray-500 transition-colors duration-500"
          ref={register({
            required: "Email is required",
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          })}
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        {errors.email?.message && <FormError error={errors.email?.message} />}
        {errors.email?.type === "pattern" && (
          <FormError error="Please enter a valid email" />
        )}
        <input
          className="border border-gray-300 focus:outline-none px-5 py-3 focus:border-gray-500 transition-colors duration-500"
          ref={register({
            required: "Password is required"
          })}
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        {errors.password?.message && (
          <FormError error={errors.password?.message} />
        )}
        <Button isValid={formState.isValid} loading={loading} text="Log In" />
        {loginResults?.login.error && (
          <FormError error={loginResults.login.error} />
        )}
      </form>
      <div>
          New to Podcast?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
    </div>
  );
};
