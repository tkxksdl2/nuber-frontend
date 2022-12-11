import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../gql/graphql";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTAION = gql`
  mutation createRestaurant($createRestaurantInput: CreateRestaurantInput!) {
    createRestaurant(input: $createRestaurantInput) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, _] = useState({ url: "" });
  const client = useApolloClient();
  const navigate = useNavigate();

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      setUploading(false);
      const { name, categoryName, address } = getValues();
      const queryResult = client.readQuery({
        query: MY_RESTAURANTS_QUERY,
        variables: { input: { page: 1 } },
      });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        variables: { input: { page: 1 } },
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            totalPages: queryResult.myRestaurants.totalPages || 1,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImage: imageUrl.url,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      navigate("/", { replace: true });
    }
  };
  const [createRestaurantMuation, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTAION);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormProps>({ mode: "onBlur" });

  const fetchUrl =
    process.env.NODE_ENV === "production"
      ? window.location.origin + "/uploads/"
      : "http://localhost:4000/uploads/";

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url } = await (
        await fetch(fetchUrl, {
          method: "POST",
          body: formBody,
        })
      ).json();
      imageUrl.url = url;

      createRestaurantMuation({
        variables: {
          createRestaurantInput: {
            name,
            categoryName,
            address,
            coverImage: url,
          },
        },
        onCompleted,
      });
    } catch {}
  };

  return (
    <div className="flex-container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1 className="font-bold text-3xl">Add Restaurant</h1>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <form
          className="grid gap-3 mt-5 mb-2 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("name", { required: "Name is required." })}
            placeholder="Name"
            className="input"
          />
          <input
            {...register("address", { required: "Address is required." })}
            placeholder="Address"
            className="input"
          />
          <input
            {...register("categoryName", {
              required: "Category Name is required.",
            })}
            placeholder="Category Name"
            className="input"
          />
          <div>
            <input
              {...register("file", { required: true })}
              accept="image/*"
              type="file"
            />
          </div>
          <Button
            loading={uploading}
            canClick={isValid}
            actionText="CreateRestaurant"
          />
          {data?.createRestaurant.error && (
            <FormError errorMessage={data?.createRestaurant.error} />
          )}
        </form>
      </div>
    </div>
  );
};
