import {Route, Routes} from "react-router";
import { routes} from "../../constants"


function Body() {
    return (
        <div className={'max-w-screen-lg h-[97%]  bg-blue-50 mx-auto min-w-[1024px]  '}>
            <Routes>
                {
                    routes.map((item, index)=>(
                        <Route key={index} path={item.path}  element={item.element} />
                    ))
                }
            </Routes>
        </div>
    );
}

export default Body;