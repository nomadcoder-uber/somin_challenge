import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { isLoggedInVar } from "../apollo";
import { FormError } from "../components/form-error";
import { loginMutationVariables,loginMutation } from "../__generated__/loginMutation";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput:LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;
interface ILoginForm {
  email: string;
  password: string;
  resultError?: string;
}
export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
  const onCompleted = (data: loginMutation) => {
    const {
      login: {ok, token },
    } = data;
    if (ok && token) {
      isLoggedInVar(true)
    }
  };
  const [loginMutation, { data: loginMutationResult,loading }] = useMutation<
  loginMutation,
  loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
           },
        },
      });
    }
};
    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-indigo-200">
          <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
            <h3 className="text-2xl text-gray-800">Log In</h3>
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-3 mt-5 px-5"
             >
              <input
               ref={register({ required: "Email is required" })}
               name="email"
               required
               type="email"
                placeholder="Email"
                className=" bg-gray-100 shadow-inner   border-2 focus:border-opacity-60 focus:border-green-600 focus:outline-none mb-3 py-3 px-5 rounded-lg"
              />
               {errors.email?.message && (
                <FormError errorMessage={errors.email?.message} />
                )}
              <input
                ref={register({ required: "Password is required" })}
                required
                name="password"
                type="password"
                placeholder="Password"
                className=" bg-gray-100 shadow-inner focus:outline-none border-2 focus:border-opacity-60 focus:border-green-600  py-3 px-5 rounded-lg"
              />
              <button className="py-3 px-5 bg-indigo-100 text-black mt-3 text-lg rounded-lg focus:outline-none hover:opacity-90">
                {loading ? "Loading..." : "Log In"}
              </button>
              {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
            </form>
          </div>
        </div>
      );
  };