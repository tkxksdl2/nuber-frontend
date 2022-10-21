import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface IFormProps {
  searchTerm: string;
}

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const onSearchSubmit = () => {
    navigate({
      pathname: "/search",
      search: `?term=${getValues("searchTerm")}`,
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSearchSubmit)}
      className="bg-gray-800 w-full py-32 flex items-center justify-center"
    >
      <input
        {...register("searchTerm", { required: true, min: 2, max: 20 })}
        className="input w-1/2 md:w-3/12 border-0 rounded-md"
        type="Search"
        placeholder="Search Restaurants..."
      />
    </form>
  );
};
