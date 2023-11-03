// import { gql, useSubscription } from "@apollo/client";
// import React from "react";

// const GAME_SUBSCRIPTION = gql`
//   subscription ($code: Int!) {
//     gameOn(code: $code) {
//       code
//       category
//       users
//     }
//   }
// `;
// export default function Waiting() {
//   const { data, loading } = useSubscription(GAME_SUBSCRIPTION, {
//     variables: { code: 1234 },
//   });

//   console.log("the data is: ", data);
//   return <div>Waiting</div>;
// }
