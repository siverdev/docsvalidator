import {RouterProvider, createBrowserRouter, Route, createRoutesFromElements} from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import CheckJournal from "./pages/CheckJournal"

const router = createBrowserRouter(
  createRoutesFromElements((
     <Route path="/" element={<AppLayout/>}>
         <Route index element={<CheckJournal/>}/>
         <Route path="check-arbitrary"/>

     </Route>
  ))
)

function App() {
  return (
     <div className="App">
        <RouterProvider router={router}/>
     </div>
 )
}

export default App
