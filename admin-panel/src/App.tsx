import './App.css'
import TopBar from "./components/TopBar/topBar.tsx";
import SideBar from "./components/SideBar/SideBar.tsx";
import Body from "./components/body/body.tsx";

function App() {

    return (
        <div className={'w-full h-full flex flex-col'}>
            <TopBar/>
            <div className="flex " style={{height: 'calc(100vh - 4rem)'}}>
                <SideBar/>
                <div className=" flex-1 h-full bg-blue-100 justify-items-center">
                    <div className={'h-2'}/>
                    <Body/>

                </div>
            </div>
        </div>
    )
}

export default App
