import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {SearchProvider} from "./context/SearchContext.tsx";
import {NotificationProvider} from "./context/NotificationContext.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <NotificationProvider>
            <SearchProvider>
                <App/>
            </SearchProvider>
        </NotificationProvider>


    </BrowserRouter>,
)