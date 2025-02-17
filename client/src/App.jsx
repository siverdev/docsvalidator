import {RouterProvider, createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom"
import Home from "./pages/Home"

const router = createBrowserRouter(
  createRoutesFromElements((
     <Route path="/" element={<Home/>}>
     </Route>
  ))
)

function App() {
  return (
     <div className="App min-h-screen bg-gray-100 flex items-center justify-center">
        <RouterProvider router={router}/>
     </div>
 )
}

export default App
