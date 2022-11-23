import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragment";
import {
  CookedOrdersSubscription,
  FullOrderPartsFragment,
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../gql/graphql";
import { useFragment } from "../../gql";
import { useNavigate } from "react-router-dom";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => {
  return (
    <div className="h-5 w-5 flex justify-center items-center text-lg bg-white rounded-full">
      🚙
    </div>
  );
};

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 37.5666805,
    lng: 126.9784147,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState();

  const onSucces = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({
      lat: latitude,
      lng: longitude,
    });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocorder = new google.maps.Geocoder();
      geocorder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (result, status) => {
          console.log(status, result);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng - 0.05
            ),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  const { data: cookedOrdersData } = useSubscription<CookedOrdersSubscription>(
    COOKED_ORDERS_SUBSCRIPTION
  );
  const order = useFragment<FullOrderPartsFragment>(
    FULL_ORDER_FRAGMENT,
    cookedOrdersData?.cookedOrders
  );
  useEffect(() => {
    if (order?.id) {
      makeRoute();
    }
  });

  const navigate = useNavigate();
  const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok) {
      navigate(`/orders/${order?.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATION);
  const triggerMutation = (id: number) => {
    takeOrderMutation({ variables: { input: { id } }, onCompleted });
  };

  return (
    <div>
      <div style={{ height: "50vh", width: "100%" }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{ key: "AIzaSyBro7EcHO1KA9M1X18HnPDWHf8dWVCd7TA" }}
          defaultCenter={{
            lat: 37.5666805,
            lng: 126.9784147,
          }}
          defaultZoom={17}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div>
        <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
          {order ? (
            <>
              <h1 className="text-center text-2xl font-medium">
                New Cooked Order
              </h1>
              <h4 className="text-center my-3 text-2xl font-medium">
                Pick it up soon! @ {order.restaurant.name}
              </h4>
              <button
                onClick={() => {
                  triggerMutation(order.id);
                }}
                className="btn mt-10 w-full"
              >
                Accept challenge &rarr;
              </button>
            </>
          ) : (
            <h1 className="btn block w-full text-center mt-5">
              No Orders yet...
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};
