import {createContext, useContext} from "react";

interface NotificationContextType {

    updateNotification: (type: "error"|'success'|'warning', value: string) => void

}

export const NotificationContext = createContext<NotificationContextType>({
    updateNotification: () => {}
});


export const useNotification = () => useContext(NotificationContext)
