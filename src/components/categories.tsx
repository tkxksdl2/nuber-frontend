import React from "react";
import { Link } from "react-router-dom";
import { CategoryPartsFragment } from "../gql/graphql";

interface ICategoriesProp {
  categories?: readonly CategoryPartsFragment[];
}

export const Categories: React.FC<ICategoriesProp> = ({ categories }) => {
  if (categories) {
    return (
      <div className="flex scrollbar md:justify-center justify-start">
        {categories.map((category) => (
          <Link key={category.id} to={`/category/${category.slug}`}>
            <div className="flex flex-col group items-center">
              <div
                className=" w-14 h-14 rounded-full bg-cover group-hover:bg-gray-200 cursor-pointer mx-5"
                style={{ backgroundImage: `url(${category.coverImage})` }}
              />
              <span className="mt-1 mb-3 w-min text-sm text-center font-bold text-gray-800">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  return <></>;
};
