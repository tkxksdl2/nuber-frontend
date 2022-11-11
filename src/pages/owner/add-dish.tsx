import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../gql/graphql";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      error
      ok
    }
  }
`;

interface IFormProps {
  name: string;
  price: string;
  description: string;
  options?: IFormOptions[];
}

interface IFormOptions {
  name: string;
  extra: number;
}

type IParams = {
  restaurantId: string;
};

export const AddDish = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams() as IParams;
  const [createDishMutation, { loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: { id: +restaurantId },
        },
      },
    ],
  });
  const {
    register,
    getValues,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IFormProps>({ mode: "onBlur" });
  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  const onSubmit = () => {
    const { name, price, description, options } = getValues();
    const intOptions = options?.map((item) => ({
      ...item,
      extra: +item.extra,
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: intOptions,
        },
      },
    });
    navigate(-1);
  };

  const onAddOptionClick = () => {
    append({
      name: "",
      extra: 0,
    });
  };
  const onDeleteClick = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex-container">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h1 className="font-bold text-3xl">Add Dish</h1>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-form">
          <input
            {...register("name", {
              required: "Name is required.",
            })}
            className="input"
            placeholder="Name"
            type="text"
          />
          <input
            {...register("price", {
              required: "Price is required.",
            })}
            className="input"
            placeholder="Price"
            type="number"
            min={0}
          />
          <input
            {...register("description", {
              required: "Description is required.",
            })}
            className="input"
            placeholder="Description"
            type="text"
          />
          <div className="my-10">
            <h4 className="font-semibold mb-3 text-lg">Dish Options</h4>
            <span
              className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
              onClick={onAddOptionClick}
            >
              Add Dish Option
            </span>
            {fields.length !== 0 &&
              fields.map((field, index) => (
                <div key={field.id} className="mt-5 flex flex-row">
                  <input
                    {...register(`options.${index}.name`, {
                      required: true,
                      shouldUnregister: true,
                    })}
                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                    type="text"
                    placeholder="Option Name"
                  />
                  <input
                    {...register(`options.${index}.extra`, {
                      shouldUnregister: true,
                    })}
                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                    type="number"
                    min={0}
                    placeholder="Option Extra"
                  />
                  <span
                    className="cursor-pointer text-white bg-red-500 py-3 px-4 hover:bg-red-800"
                    onClick={() => {
                      onDeleteClick(index);
                    }}
                  >
                    Delete Option
                  </span>
                </div>
              ))}
          </div>
          <Button
            canClick={isValid}
            loading={loading}
            actionText="Create Dish"
          />
        </form>
      </div>
    </div>
  );
};
