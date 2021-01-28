import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
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
    getValues,
    errors,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Listener,
    },
  });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Account Created! Log in now!");
      history.push("/");
    }
  };
  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gray-900 ">
      <div className="max-w-screen-md w-full px-4">
        <div className="flex justify-between  py-5  tracking-widest">
          <Link to="/my-profile">
            <FontAwesomeIcon
              icon={faAngleLeft}
              className="text-2xl text-white"
            />
          </Link>
          <h1 className="text-white font-semibold mb-6 ">SING UP</h1>
          <h1 className="text-yellow-400 font-semibold">DONE</h1>
        </div>
        <Helmet>
          <title>Create Account | Podcast</title>
        </Helmet>
        <form
          className="grid gap-3 w-full px-10 text-gray-400"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-gray-400 text-opacity-75 text-base ">EMAIL</p>
          <input
            className="border border-gray-700 bg-gray-700 focus:outline-none px-5 py-3"
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
          <p className="text-gray-400 text-opacity-75 text-base">
            CREATE PASSWORD
          </p>
          <input
            className="border border-gray-700 bg-gray-700 focus:outline-none px-5 py-3"
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
          <select
            name="role"
            ref={register({ required: true })}
            className="h-10 bg-gray-700 my-2"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            isValid={formState.isValid}
            loading={loading}
            text="Create Account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div className="py-5 text-white text-center">
          Already have an account?{" "}
          <Link to="/" className="hover:underline text-white">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
