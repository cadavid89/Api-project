import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import AllSpots from "./components/AllSpots";
import CurrentUserSpot from "./components/CurrentUserSpots";
import SpotDetail from "./components/SpotDetail";
import EditSpotForm from "./components/EditSpotForm";
import CreateSpotForm from "./components/CreateSpotForm";
import { Modal } from "./context/Modal";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Navigation isLoaded={isLoaded} />
        <Modal />
        {isLoaded && (
          <Routes>
            <Route path="/" element={<AllSpots />} />
            <Route path="/spots/new" element={<CreateSpotForm />} />
            <Route path="/spots/current" element={<CurrentUserSpot />} />
            <Route path="/spots/:spotId/edit" element={<EditSpotForm />} />
            <Route path="/spots/:spotId" element={<SpotDetail />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

//   return (
//     <>
//       <Navigation isLoaded={isLoaded} />
//       {isLoaded && <Outlet />}
//     </>
//   );
// }

// const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: '/',
//         element: <AllSpots />
//       },
//       {
//         path: '/spots/current',
//         element: <CurrentUserSpot />
//       },
//       {
//         path: '/spots/:spotId',
//         element: <SpotDetail />
//       },
//       {
//         path: '/spots/:spotId/edit',
//         element: <EditSpotForm />
//       },
//       {
//         path: 'spots/new',
//         element: <CreateSpotForm />
//       }
//     ]
//   }
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

export default App;
