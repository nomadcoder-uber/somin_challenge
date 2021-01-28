import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { login, loginVariables } from "../__generated__/login";
import { LOCALSTORAGE_TOKEN } from "../constants";
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookSquare,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

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
export const deleteToken = () => {
  localStorage.removeItem(LOCALSTORAGE_TOKEN);
};
export const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    errors,
    formState,
  } = useForm<ILoginForm>({ mode: "onChange" });
  const onCompleted = (data: login) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };
  const [login, { data: loginResults, loading }] = useMutation<
    login,
    loginVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onValid = () => {
    const { email, password } = getValues();
    login({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className="h-screen flex flex-col items-center bg-gray-900 ">
      <div className="max-w-screen-md w-full px-4">
        <div className="flex justify-between py-5 tracking-widest">
          <Link to="/my-profile">
            <FontAwesomeIcon
              icon={faAngleLeft}
              className="text-2xl text-white"
            />
          </Link>
          <h1 className="text-white font-semibold mb-6 ">LOGIN</h1>
          <h1 className="text-yellow-400 font-semibold">DONE</h1>
        </div>
        <Helmet>
          <title>Login | Podcast</title>
        </Helmet>
        <div className="flex justify-between w-full px-4 text-center text-xl text-white">
          <div className="box-border rounded-md border-white w-44 bg-purple-700 h-12  ">
            <Link to="/facebook">
              <FontAwesomeIcon
                icon={faFacebookSquare}
                className="text-2xl text-white mt-2.5 mr-2 "
              />
              FACEBOOK
            </Link>
          </div>
          <div className="box-border rounded-md border-white w-44 bg-blue-400 h-12">
            <Link to="/twitter" className="">
              <FontAwesomeIcon
                icon={faTwitter}
                className="text-2xl text-white mt-2.5 mr-2"
              />
              TWITTER
            </Link>
          </div>
        </div>
        <div className="w-full px-4 py-7 flex justify-between">
          <hr className="w-44" />
          <p className="text-white"> OR </p>
          <hr className="w-44" />
        </div>

        {/* <h2 className="text-3xl mb-9">Welcome</h2> */}
        <form
          className="grid gap-3 w-full px-4 text-gray-400"
          onSubmit={handleSubmit(onValid)}
        >
          <p className="text-gray-400 text-opacity-75 text-base">EMAIL</p>
          <input
            className="border border-gray-700 bg-gray-700 focus:outline-none px-5 py-3 ;"
            ref={register({
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            required
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage="Please enter a valid email" />
          )}
          <p className="text-gray-400 text-opacity-75 text-base">PASSWORD</p>
          <input
            className="border border-gray-700 bg-gray-700 focus:outline-none px-4 py-3  ;"
            ref={register({
              required: "Password is required",
            })}
            name="password"
            type="password"
            required
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button isValid={formState.isValid} loading={loading} text="Log In" />
          {loginResults?.login.error && (
            <FormError errorMessage={loginResults.login.error} />
          )}
        </form>
        <div className="py-5 text-white text-center">
          New to Podcast?{" "}
          <Link to="/create-account" className="hover:underline text-lime-600">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
